import { Outlet, useLoaderData } from '@remix-run/react';
import { StudentInDatagrid } from './_components/DataGrid';

import { StudentClassMapType, StudentWithCourse } from '~/types/collection';
import { createClient } from '@supabase/supabase-js';
import { Database } from '~/types/supabase';
import StudentsDataTable from './_components/StudentsDataTable';
import { AddStudentSheet } from './_components/AddStudentSheet';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import { createServerClient } from '@supabase/auth-helpers-remix';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const businessId = params.businessId;

  if (!businessId) {
    return redirect('/404');
  }

  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select(`*, courses: classes(*), courseIds: classes(id)`)
    .eq('business_id', businessId);

  const { data: classes, error: classesError } = await supabase
    .from('classes')
    .select('*')
    .eq('business_id', businessId);

  const formattedStudents: StudentWithCourse[] =
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

export const action = async ({ request }: ActionFunctionArgs) => {
  const response = new Response();

  const supabaseClient = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const body = await request.formData();
  const { _action, ...values } = Object.fromEntries(body);

  if (_action === 'delete') {
    const { data, error } = await supabaseClient
      .from('students')
      .delete()
      .eq('id', values.id);
  }

  return null;
};

function StudentsLayout() {
  const { students, classes } = useLoaderData<typeof loader>();

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
          <AddStudentSheet courses={classes} />
        </div>
      </div>
      <StudentsDataTable data={students} />
      <Outlet />
    </>
    // <DataGrid
    //   students={students}
    //   courses={classes}
    //   updateData={handleUpdateData}
    // />
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
