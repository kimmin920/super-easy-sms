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
  numberOfMonths: number;
}

export function HolidayCalendar({
  holidayDates,
  fromDate,
  toDate,
  numberOfMonths,
  setHolidayDates,
}: HolidayCalendarProps) {
  return (
    <>
      <style>{css}</style>
      <CalendarCore
        mode='single'
        numberOfMonths={numberOfMonths}
        today={undefined}
        fromDate={fromDate}
        toDate={toDate}
        selected={holidayDates}
        onSelect={setHolidayDates}
        className='rounded-md border shadow justify-center flex w-full'
        modifiersClassNames={{
          selected: 'holiday-selected',
        }}
      />
    </>
  );
}
