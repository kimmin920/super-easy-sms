'use client';

import { Calendar as CalendarCore } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

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
  className?: string;
}

export function HolidayCalendar({
  holidayDates,
  fromDate,
  toDate,
  numberOfMonths,
  className,
  setHolidayDates,
}: HolidayCalendarProps) {
  return (
    <>
      <style>{css}</style>
      <CalendarCore
        mode='multiple'
        numberOfMonths={numberOfMonths}
        today={undefined}
        fromDate={fromDate}
        toDate={toDate}
        selected={holidayDates}
        onSelect={setHolidayDates}
        className={cn(
          'rounded-md border shadow justify-center flex w-full',
          className
        )}
        modifiersClassNames={{
          selected: 'holiday-selected',
        }}
      />
    </>
  );
}
