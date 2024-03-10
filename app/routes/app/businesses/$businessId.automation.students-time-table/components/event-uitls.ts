import { EventInput } from '@fullcalendar/core';
import { parseCourseSchedule } from '~/services/utils/courseUtils';

import { startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';

let eventGuid = 0;
const todayStr = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: todayStr,
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: todayStr + 'T12:00:00',
  },
];

export function createEventId() {
  return String(eventGuid++);
}

interface EventInput {
  id: string;
  title: string;
  start: string;
  end?: string;
}

function getCurrentWeekDatesObject(): Record<string, string> {
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 0 }); // Set week start to Sunday
  const end = endOfWeek(today, { weekStartsOn: 0 }); // Set week end to Saturday

  const weekDays = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ];
  const datesInterval = eachDayOfInterval({ start, end });

  const datesObject = datesInterval.reduce((acc, date, index) => {
    const dayKey = weekDays[date.getDay()]; // Get the day of the week in uppercase
    acc[dayKey] = format(date, 'yyyy-MM-dd'); // Format dates as "YYYY-MM-DD"
    return acc;
  }, {} as Record<string, string>);

  return datesObject;
}

console.log(getCurrentWeekDatesObject());

function dayOfWeekAsInteger(day: string): number {
  return [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ].indexOf(day.toUpperCase());
}

export function parseScheduledDays(courses: Course[]): EventInput[] {
  const events: EventInput[] = [];

  courses.forEach((course) => {
    course.scheduledDays.forEach((schedule) => {
      const { startTime, endTime, day } = parseCourseSchedule(schedule);
      const currentWeek = getCurrentWeekDatesObject();

      if (!day) {
        return;
      }

      const nextDayStr = currentWeek[day];

      events.push({
        id: createEventId(),
        title: course.name,
        start: `${nextDayStr}T${startTime}`,
        end: `${nextDayStr}T${endTime}`,
      });
    });
  });

  return events;
}
