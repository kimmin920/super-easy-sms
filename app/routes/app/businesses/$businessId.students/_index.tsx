import { useLoaderData } from '@remix-run/react';
import DataGrid, { StudentInDatagrid } from './_components/DataGrid';

import { StudentClassMapType } from '~/types/collection';
import { createClient } from '@supabase/supabase-js';
import { Database } from '~/types/supabase';

export const loader = async () => {
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select(`*, courses: classes(*), courseIds: classes(id)`);

  const { data: classes, error: classesError } = await supabase
    .from('classes')
    .select('*');

  const formattedStudents: StudentInDatagrid[] =
    students?.map((student) => ({
      ...student,
      courseIds: student.courseIds.map((each) => each.id),
    })) ?? [];

  return {
    students: formattedStudents,
    classes: classes ?? [],
    studentsError,
    classesError,
  };
};

function StudentsLayout() {
  const { students, classes } = useLoaderData<typeof loader>();

  const handleUpdateData = async (updatedData: StudentInDatagrid[]) => {
    const result = await updateData(updatedData);

    if (result.success) {
      // NOTE: must change this window alert to modal or toast
      window.alert('SUCCESS!');
      return;
    }

    if (result.error) {
      window.alert('ERROR!');
      return;
    }
  };

  return (
    <DataGrid
      students={students}
      courses={classes}
      updateData={handleUpdateData}
    />
  );
}

async function updateData(updatedData: StudentInDatagrid[]) {
  const supabase = createClient<Database>(
    window.ENV.SUPABASE_URL,
    window.ENV.SUPABASE_ANON_KEY
  );

  const studentCourseMap = updatedData.reduce(
    (acc: StudentClassMapType[], cur) => {
      const { id, courseIds } = cur;

      const array = courseIds.map((cid) => ({
        studentId: id,
        courseId: cid,
      }));

      return acc.concat(array);
    },
    []
  );

  // TODO: the work below should be handled in a safe and sequencial way.

  const { error } = await supabase.from('students').upsert(
    updatedData.map((student) => ({
      id: student.id,
      name: student.name,
      phoneNumber: student.phoneNumber,
      email: student.email,
    }))
  );

  if (error) {
    return { error };
  }

  const { error: deleteError } = await supabase
    .from('students_classes_map')
    .delete()
    .neq('id', 0);

  if (deleteError) {
    return { error: deleteError };
  }

  const { error: insertError } = await supabase
    .from('students_classes_map')
    .insert(
      studentCourseMap.map((data) => ({
        student_id: data.studentId,
        class_id: data.courseId,
      }))
    );

  if (insertError) {
    return { error: insertError };
  }

  return { success: true };
}

export default StudentsLayout;
