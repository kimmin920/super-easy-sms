import { addDays } from 'date-fns';
import { DateRange } from 'react-day-picker';

export const getDatesBetween = (
  dateRange: DateRange,
  holidays: Date[]
): Date[] => {
  const { from, to } = dateRange;
  const dates = [];
  let currentDate = new Date(from);

  while (currentDate <= to) {
    // Exclude weekends and holidays
    if (
      !holidays.some((holiday) => holiday.getTime() === currentDate.getTime())
    ) {
      dates.push(new Date(currentDate));
    }

    currentDate = addDays(currentDate, 1);
  }

  return dates;
};
