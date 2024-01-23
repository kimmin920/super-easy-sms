import { addDays, format } from 'date-fns';
import { ko } from 'date-fns/locale';

import React from 'react';
import { DateRange } from 'react-day-picker';
import { HolidayCalendar } from '~/components/HolidayCalander';
import { DatePickerWithRange } from '~/components/DatePickerWithRange';
import SMSTemplateSwitcher, {
  messageTemplates,
} from './_components/SMSTemplateSwitcher';
import TemplateParser from './_components/TemplateParser';
import {
  ClassesWithPayment,
  StudentsDataTable,
  StudentsDataTableProps,
} from './_components/StudentsDataTable';
import { students } from '../../$businessId.students/_mockdata';
import { TemplateHandler, getDatesBetween } from './utils';
import { allClasses } from '../../$businessId.classes/_mockdata';
import TemplateGenerator from './_components/TemplateGenerator';
import { Button } from '@/components/ui/button';

interface NonNullableDateRande {
  from: NonNullable<DateRange['from']>;
  to: NonNullable<DateRange['to']>;
}
function SuperEasySms() {
  const [date, setDate] = React.useState<NonNullableDateRande>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

  const [holidays, setHolidays] = React.useState<Date[]>([]);

  const selectedTemplate = messageTemplates.find(
    (template) => template.value === '1'
  );

  const workingDates = getDatesBetween(date, holidays);

  const mainData: StudentsDataTableProps['data'] = students.map((student) => {
    const classesWithPayment: Array<ClassesWithPayment | null> = student.classes
      .map((eachClass) => {
        const currentClass = allClasses.find((each) => each.id === eachClass);

        if (!currentClass) {
          return null;
        }

        const classDates = workingDates.filter((each) => {
          const day = each.toLocaleDateString('en-US', { weekday: 'long' });
          return currentClass?.days.includes(day);
        });

        return {
          ...currentClass,
          activeClassDates: classDates,
          priceOfCounts: currentClass.pricePerClass * classDates.length,
        };
      })
      .filter((each) => each !== null);

    const totalAmount = classesWithPayment.reduce((acc, cur) => {
      if (!cur) {
        return acc;
      }

      return acc + cur.priceOfCounts;
    }, 0);

    const message = new TemplateHandler(selectedTemplate?.message ?? '')
      .split()
      .replace('학생', student.name)
      .replace('시작일', format(date.from, 'PPP', { locale: ko }))
      .replace('종료일', format(date.to, 'PPP', { locale: ko }))
      .replace(
        '금액',
        new Intl.NumberFormat('ko-KR', {
          style: 'currency',
          currency: 'KRW',
        }).format(totalAmount)
      )
      .getParsedMessage();

    return {
      ...student,
      totalPrice: totalAmount,
      status: 'pending',
      classesWithPayment,
      message,
    };
  });

  return (
    <>
      <h2 className='text-2xl font-semibold tracking-tight'>Super Easy SMS</h2>
      <div>
        학생 테이블
        <StudentsDataTable data={mainData} />
      </div>

      <h2 className='text-2xl font-semibold tracking-tight'>Settings</h2>
      <div>
        <div>
          정산기간:
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>

        <div>
          공휴일:
          <HolidayCalendar
            holidayDates={holidays}
            setHolidayDates={setHolidays}
            fromDate={date.from}
            toDate={date.to}
          />
        </div>

        <div>
          템플릿: <SMSTemplateSwitcher selectedBusinessId={'1'} />
          <div>
            미리보기:
            {<TemplateParser inputString={selectedTemplate?.message ?? ''} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default SuperEasySms;
