import { redirect, useLoaderData } from '@remix-run/react';
import TimeTable from './components/timeTable';
import { createClient } from '@supabase/supabase-js';
import { Database } from '~/types/supabase';
import { LoaderFunctionArgs } from '@remix-run/node';
import { CourseType, StudentWithCourse } from '~/types/collection';
import ListItem from '../_components/ListItem';
import { useState } from 'react';
import { parseScheduledDays } from './components/event-uitls';

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

function StudentsTimeTable() {
  const { students, classes } = useLoaderData<typeof loader>();
  const [schedules, setSchedules] = useState<CourseType[]>([]);

  const events = parseScheduledDays(schedules);

  return (
    <div>
      {students.map((student) => (
        // <NavLink key={student.id}>
        <ListItem
          key={student.id}
          title={student.name!}
          onClick={() => setSchedules(student.courses)}
          description={student.courses
            .map((each) => each.scheduledDays)
            .join('\n')}
        />
        // </NavLink>
      ))}

      <TimeTable events={events} />
    </div>
  );
}

// {
//   id: createEventId(),
//   title: 'All-day event',
//   start: todayStr,
// },
// {
//   id: createEventId(),
//   title: 'Timed event',
//   start: todayStr + 'T12:00:00',
// },

// function courseParser(courses: CourseType[]): EventInput[] {
//   let eventGuid = 0;

//   const events = courses.map((course) => {
//     return {
//       id: String(eventGuid++),
//       title: course.name,
//     };
//   });
//   return [];
// }

export default StudentsTimeTable;
