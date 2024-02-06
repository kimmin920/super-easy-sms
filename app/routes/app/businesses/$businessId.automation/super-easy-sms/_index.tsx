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
import { createClient } from '@supabase/supabase-js';
import { useLoaderData } from '@remix-run/react';
import { Database, Json } from '~/types/supabase';
import { CourseType } from '~/types/collection';
import { DayInString } from '~/types/day';
import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { ResponsiveDrawerDialog } from '~/components/ResponsiveDrawerDialog';
import { Button } from '@/components/ui/button';

interface NonNullableDateRande {
  from: NonNullable<DateRange['from']>;
  to: NonNullable<DateRange['to']>;
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const businessId = params.businessId;

  if (!businessId) {
    return redirect('/403');
  }

  const superbase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data: students, error: studentsError } = await superbase
    .from('students')
    .select(`*, classes: classes(*), classIds: classes(id)`)
    .eq('business_id', businessId);

  const { data: classes, error: classesError } = await superbase
    .from('classes')
    .select('*')
    .eq('business_id', businessId);

  const { data: templates, error: templatesError } = await superbase
    .from('sms_templates')
    .select('*')
    .eq('business_id', businessId);

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
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  const { data, error } = await supabase.from('sms_templates').insert({
    template: values.template as Json,
    title: values.title as string,
  });

  return { data, error };
};

function SuperEasySms() {
  const { students, templates } = useLoaderData<typeof loader>();

  const [date, setDate] = React.useState<NonNullableDateRande>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

  const [holidays, setHolidays] = React.useState<Date[]>([]);

  const [selectedTemplateId, setSelectedTemplateId] = React.useState<
    number | null
  >(null);
  const selectedTemplate = templates.find(
    (each) => each.id === selectedTemplateId
  );

  const workingDates = getDatesBetween(date, holidays);

  function onClickTemplate(id: number) {
    setSelectedTemplateId(id);
  }

  const mainData: StudentsDataTableProps['data'] = students.map((student) => {
    const classesWithPayment: Array<ClassesWithPayment | null> = student.classes
      .map((eachClass: CourseType) => {
        const classDates = workingDates.filter((each) => {
          const day = each
            .toLocaleDateString('en-US', {
              weekday: 'long',
            })
            .toUpperCase() as DayInString;

          return eachClass.scheduledDays.includes(day);
        });

        const pricePerClass = eachClass.price / eachClass.classCount;

        return {
          ...eachClass,
          activeClassDates: classDates,
          priceOfCounts: pricePerClass * classDates.length,
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
      ? JSON.parse(selectedTemplate.template)
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

      <ResponsiveDrawerDialog
        title='Settings'
        description={'설정 즉시 반영됩니다.'}
        closeText='confirm'
        form={
          <>
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
          </>
        }
        button={<Button>Settings</Button>}
      />
      {/* <h2 className='text-2xl font-semibold tracking-tight'>Settings</h2> */}
      <div></div>
    </>
  );
}

export default SuperEasySms;
