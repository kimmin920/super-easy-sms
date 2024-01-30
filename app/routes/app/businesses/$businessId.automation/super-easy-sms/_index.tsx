import { addDays, format } from 'date-fns';
import { ko } from 'date-fns/locale';

import React from 'react';
import { DateRange } from 'react-day-picker';
import { HolidayCalendar } from '~/components/HolidayCalander';
import { DatePickerWithRange } from '~/components/DatePickerWithRange';
import SMSTemplateSwitcher from './_components/SMSTemplateSwitcher';
import TemplateParser from './_components/TemplateParser';
import {
  ClassesWithPayment,
  StudentsDataTable,
  StudentsDataTableProps,
} from './_components/StudentsDataTable';

import { getDatesBetween, templateMessageInjector } from './utils';
import { Class, DayInString } from '../../$businessId.classes/_mockdata';
import { createClient } from '@supabase/supabase-js';
import { useLoaderData } from '@remix-run/react';

interface NonNullableDateRande {
  from: NonNullable<DateRange['from']>;
  to: NonNullable<DateRange['to']>;
}

export const loader = async () => {
  const superbase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data: students, error: studentsError } = await superbase
    .from('students')
    .select(`*, classes: classes(*), classIds: classes(id)`);

  const { data: classes, error: classesError } = await superbase
    .from('classes')
    .select('*');

  const { data: templates, error: templatesError } = await superbase
    .from('sms_templates')
    .select('*');

  return {
    students: students ?? [],
    classes: classes ?? [],
    templates: templates ?? [],
    templatesError,
    studentsError,
    classesError,
  };
};

export const action = async ({ request }: { request: Request }) => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  const { data, error } = await supabase
    .from('sms_templates')
    .insert([{ template: values.template, title: values.title }]);

  return { data, error };
};

function SuperEasySms() {
  const { students, classes, templates } = useLoaderData<typeof loader>();

  const [date, setDate] = React.useState<NonNullableDateRande>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

  const [holidays, setHolidays] = React.useState<Date[]>([]);

  const [selectedTemplateId, setSelectedTemplateId] = React.useState<
    number | null
  >(null);

  const workingDates = getDatesBetween(date, holidays);

  function onClickTemplate(id: number) {
    setSelectedTemplateId(id);
  }

  const selectedTemplate = templates.find(
    (each) => each.id === selectedTemplateId
  );

  const mainData: StudentsDataTableProps['data'] = students.map((student) => {
    const classesWithPayment: Array<ClassesWithPayment | null> = student.classes
      .map((eachClass: Class) => {
        const classDates = workingDates.filter((each) => {
          const day = each.toLocaleDateString('en-US', {
            weekday: 'long',
          }) as DayInString;

          return eachClass.scheduledDays?.includes(day);
        });

        const pricePerClass = eachClass.price / eachClass.classCount;

        return {
          ...eachClass,
          activeClassDates: classDates,
          priceOfCounts: pricePerClass,
        };
      })
      .filter((each) => each !== null);

    const totalAmount = classesWithPayment.reduce((acc, cur) => {
      if (!cur) {
        return acc;
      }

      return acc + cur.priceOfCounts;
    }, 0);

    const template = selectedTemplate?.template
      ? JSON.parse(selectedTemplate?.template)
      : null;

    const message = templateMessageInjector(template?.content, {
      학생이름: student.name,
      정산시작일: format(date.from, 'PPP', { locale: ko }),
      정산종료일: format(date.to, 'PPP', { locale: ko }),
      정산금액: new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
      }).format(totalAmount),
    });

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
          템플릿:
          <SMSTemplateSwitcher
            selectedTemplateId={selectedTemplateId}
            messageTemplates={templates}
            onClickTemplate={onClickTemplate}
          />
          <div>
            미리보기:
            <TemplateParser template={selectedTemplate?.template ?? ''} />
          </div>
        </div>
      </div>
    </>
  );
}

export default SuperEasySms;
