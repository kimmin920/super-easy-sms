import { Outlet, useLoaderData } from '@remix-run/react';
import { StudentInDatagrid } from './_components/DataGrid';

import { StudentClassMapType } from '~/types/collection';
import { createClient } from '@supabase/supabase-js';
import { Database } from '~/types/supabase';
// import StudentsDataTable from './_components/StudentsDataTable';
import { AddStudentSheet } from './_components/AddStudentSheet';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import {
  deleteOneStudent,
  getManyStudents,
} from '~/server/students/students.server';
import { getStudentsSearchParams } from '~/helper/students.helper';
import { getAllCourses } from '~/server/courses/courses.server';
import StudentsDataTable from '~/components/students/StudentsTable';
import { basicAction } from '~/components/students/StudentsDataTableColumns';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const businessId = params.businessId;

  if (!businessId) {
    return redirect('/404');
  }

  const { start, end, name } = getStudentsSearchParams(request.url);

  const { students, error: studentsError } = await getManyStudents({
    businessId,
    range: { start: Number(start), end: Number(end) },
    parmas: {
      name,
    },
  });

  const { courses, error: coursesError } = await getAllCourses({ businessId });

  if (studentsError || coursesError) {
    return redirect('/500');
  }

  return {
    students,
    courses,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();

  const { _action, ...values } = Object.fromEntries(body);

  if (_action === 'delete') {
    const { status, error } = await deleteOneStudent(values.id);

    if (error) {
      return redirect(`/${status}`);
    }
  }

  return null;
};

function StudentsLayout() {
  const { students, courses } = useLoaderData<typeof loader>();

  return (
    <>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Students</h2>
          <p className='text-muted-foreground'>
            Here&apos;s a list of your students!
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          <AddStudentSheet courses={courses} />
        </div>
      </div>
      <StudentsDataTable data={students} actionColumn={basicAction} />
      <Outlet />
    </>
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
