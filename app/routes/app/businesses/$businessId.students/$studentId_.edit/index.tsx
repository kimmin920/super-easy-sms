import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { EditStudentSheet } from '../_components/EditStudentSheet';
import { getOneStudent } from '~/server/students/students.server';
import { parseStudentTypeToStudentFormType } from '~/helper/students.helper';
import { getAllCourses } from '~/server/courses/courses.server';
import { StudentFormType } from '~/components/students/StudentForm';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const studentId = Number(params.studentId);
    const businessId = Number(params.businessId);

    if (Number.isNaN(studentId) || Number.isNaN(businessId)) {
      throw redirect('/400');
    }

    const { student } = await getOneStudent({ businessId, studentId });
    const { courses } = await getAllCourses({ businessId });

    const studentWithCourses: StudentFormType =
      parseStudentTypeToStudentFormType(student);

    return typedjson({
      courses: courses,
      student: studentWithCourses,
    });
  } catch (error) {
    throw redirect('/500');
  }
};

function EditStudent() {
  const { student, courses } = useTypedLoaderData<typeof loader>();

  return <EditStudentSheet student={student} courses={courses} />;
}

export default EditStudent;
