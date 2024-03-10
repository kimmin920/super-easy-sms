import { DayInString } from '~/types/day';

export function parseCourseSchedule(string: string): {
  day: DayInString | null;
  startTime: string;
  endTime: string;
} {
  const dayMatch = string.match(/#day:([A-Z]+)@/);
  const startMatch = string.match(/@start:(\d{2}:\d{2})@/);
  const endMatch = string.match(/@end:(\d{2}:\d{2})/);

  return {
    day: dayMatch ? (dayMatch[1] as DayInString) : null,
    startTime: startMatch ? startMatch[1] : '',
    endTime: endMatch ? endMatch[1] : '',
  };
}
