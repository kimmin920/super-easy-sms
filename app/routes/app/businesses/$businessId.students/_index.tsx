import { json, useFetcher, useLoaderData } from '@remix-run/react';
import DataGrid from './_components/DataGrid';

import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import { Student } from './_mockdata';
import { useState } from 'react';

function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}

export const loader = async () => {
  const superbase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data: students, error: studentsError } = await superbase
    .from('students')
    .select(`*, classes: classes(*), classIds: classes(id)`);

  const { data: classes, error: classesError } = await superbase
    .from('classes')
    .select('*');

  const formattedStudents = students?.map((student) => ({
    ...student,
    classIds: student.classIds.map((each) => each.id),
  }));

  return {
    students: formattedStudents ?? [],
    classes: classes ?? [],
    studentsError,
    classesError,
  };
};

function StudentsLayout() {
  const { students, classes } = useLoaderData<typeof loader>();

  async function updateData(updatedData: any) {
    const supabase = createBrowserClient(
      window.ENV.SUPABASE_URL,
      window.ENV.SUPABASE_ANON_KEY
    );

    const studentClassesMap = updatedData.reduce((acc, cur) => {
      const { id, classIds } = cur;

      const array = classIds.map((cid) => ({ studentId: id, classId: cid }));

      return acc.concat(array);
    }, []);

    const { data, error } = await supabase
      .from('students')
      .upsert(
        updatedData.map((student) => ({
          id: student.id,
          name: student.name,
          phoneNumber: student.phoneNumber,
          email: student.email,
        }))
      )
      .then(async () => {
        const { data, error } = await supabase
          .from('students_classes_map')
          .delete()
          .neq('id', 0);

        if (!error) {
          const { data, error } = await supabase
            .from('students_classes_map')
            .insert(
              studentClassesMap.map((data) => ({
                student_id: data.studentId,
                class_id: data.classId,
              }))
            );
        }
      });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  }

  const handleUpdateData = async (updatedData: Student[]) => {
    const result = await updateData(updatedData);

    if (result.success) {
      // const reloadedData = await loader();
    }
  };

  return (
    <div>
      <DataGrid
        data={students}
        classes={classes}
        updateData={handleUpdateData}
      />
    </div>
  );
}

export default StudentsLayout;
