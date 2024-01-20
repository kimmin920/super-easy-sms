'use client';

import { Calendar as CalendarCore } from '@/components/ui/calendar';

const css = `
  .holiday-selected:not([disabled]) {
    color: hsl(var(--destructive));
  }
  .holiday-selected:hover:not([disabled]) {
    // border-color: blue;
    // color: blue;
  }
`;

interface HolidayCalendarProps {
  holidayDates: Date[];
  setHolidayDates: React.Dispatch<React.SetStateAction<Date[]>>;
  fromDate?: Date;
  toDate?: Date;
}

export function HolidayCalendar({
  holidayDates,
  fromDate,
  toDate,
  setHolidayDates,
}: HolidayCalendarProps) {
  return (
    <>
      <style>{css}</style>
      <CalendarCore
        mode='multiple'
        numberOfMonths={2}
        today={undefined}
        fromDate={fromDate}
        toDate={toDate}
        selected={holidayDates}
        onSelect={setHolidayDates}
        className='rounded-md border shadow'
        modifiersClassNames={{
          selected: 'holiday-selected',
        }}
      />
    </>
  );
}
