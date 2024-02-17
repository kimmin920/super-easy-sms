import { addDays, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import koreaHolidaysJson from 'app/holidays/holidays.json';

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
import { GearIcon, ReloadIcon } from '@radix-ui/react-icons';
import { getDatesBetween, templateMessageInjector } from './utils';
import { createClient } from '@supabase/supabase-js';
import { useLoaderData } from '@remix-run/react';
import { Database, Json } from '~/types/supabase';
import { CourseType } from '~/types/collection';
import { DayInString } from '~/types/day';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import { ResponsiveDrawerDialog } from '~/components/ResponsiveDrawerDialog';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { TooltipPortal } from '@radix-ui/react-tooltip';

interface NonNullableDateRande {
  from: NonNullable<DateRange['from']>;
  to: NonNullable<DateRange['to']>;
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
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

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const businessId = params.businessId;

  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  if (!businessId) {
    throw Error;
  }

  const { data, error } = await supabase
    .from('sms_templates')
    .insert({
      template: values.template as Json,
      title: values.title as string,
      business_id: businessId,
    })
    .select()
    .limit(1)
    .single();

  return { data, error };
};

const nationalHolidays = koreaHolidaysJson.all;

function SuperEasySms() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { students, templates } = useLoaderData<typeof loader>();

  const [date, setDate] = React.useState<NonNullableDateRande>({
    from: new Date(),
    to: addDays(new Date(), 20),
  });

  const [holidays, setHolidays] = React.useState<Date[]>([]);

  function insertNationalHolidays() {
    const holidaysAsDates = nationalHolidays.map(
      (holiday) => new Date(holiday)
    );

    const filteredHolidays = holidaysAsDates.filter(
      (holiday) => holiday >= date.from && holiday <= date.to
    );

    setHolidays((prev) => {
      // Filter out any holidays that are already in the prev state
      const newHolidays = filteredHolidays.filter(
        (newHoliday) =>
          !prev.some(
            (prevHoliday) => prevHoliday.getTime() === newHoliday.getTime()
          )
      );
      console.log('new-holidays', newHolidays);
      return prev.concat(newHolidays);
    });
  }

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
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Students</h2>
          <p className='text-muted-foreground'>정산 / 문자템플릿 / SMS</p>
        </div>
        <div className='flex items-center space-x-2'>
          <ResponsiveDrawerDialog
            title='Settings'
            description={'설정 즉시 반영됩니다.'}
            closeText='confirm & close'
            button={
              <Button>
                <GearIcon className='mr-2 h-4 w-4' />
                Settings
              </Button>
            }
            form={
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col'>
                  <Label>정산 기간</Label>
                  <DatePickerWithRange
                    className='pt-2'
                    date={date}
                    setDate={setDate}
                  />
                </div>

                <div className='flex flex-col'>
                  <div className='flex items-center justify-between'>
                    휴일 (정산 제외일)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            size='sm'
                            className={'flex text-left font-normal h-5'}
                            onClick={insertNationalHolidays}
                          >
                            공휴일
                            <ReloadIcon className='ml-1' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipPortal>
                          <TooltipContent>
                            <p>기간 내 공휴일 불러옵니다</p>
                          </TooltipContent>
                        </TooltipPortal>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <HolidayCalendar
                    className='mt-2'
                    numberOfMonths={isDesktop ? 2 : 1}
                    holidayDates={holidays}
                    setHolidayDates={setHolidays}
                    fromDate={date.from}
                    toDate={date.to}
                  />
                </div>

                <div className='flex flex-col'>
                  <Label>문자 템플릿</Label>
                  <SMSTemplateSwitcher
                    className='w-[300px] mt-2'
                    selectedTemplateId={selectedTemplateId}
                    messageTemplates={templates}
                    onClickTemplate={onClickTemplate}
                  />
                </div>

                {selectedTemplate?.template && (
                  <div className='flex flex-col'>
                    미리보기
                    <TemplateParser template={selectedTemplate.template} />
                  </div>
                )}
              </div>
            }
          />
        </div>
      </div>

      <div>
        <StudentsDataTable data={mainData} />
      </div>
    </>
  );
}

export default SuperEasySms;
