import { Outlet, useLoaderData } from '@remix-run/react';
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
import {
  editAndDeleteStudentColumn,
  schoolColumn,
} from '~/components/students/StudentsDataTableColumns';

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
      <StudentsDataTable
        data={students}
        extraColumns={[schoolColumn, editAndDeleteStudentColumn]}
      />
      <Outlet />
    </>
  );
}

export default StudentsLayout;
