import { StudentFormType } from '~/components/students/StudentForm';
import { getOneStudent } from '~/server/students/students.server';
import {
  CourseType,
  StudentJoinCoursesType,
  StudentType,
  StudentWithCourse,
} from '~/types/collection';

export function getStudentsSearchParams(urlString: string) {
  const url = new URL(urlString);
  const start = url.searchParams.get('start') ?? 0;
  const end = url.searchParams.get('end') ?? 15;
  const name = url.searchParams.get('name') ?? '';

  return {
    start,
    end,
    name,
  };
}

export function parseStudentTypeToStudentFormType(
  student: StudentJoinCoursesType
): StudentFormType {
  const courseIds = student.courseIds.map((course) => ({
    value: course.id.toString(),
  }));

  return {
    ...student,
    birthday: student.birthday ? new Date(student.birthday) : new Date(),
    preferredNotificationType: student.preferred_notification_type!,
    school: student.school,
    note1: student.note1,
    note2: student.note2,
    courseIds,
  };
}
