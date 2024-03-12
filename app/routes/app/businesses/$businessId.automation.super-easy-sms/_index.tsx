import { addDays, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import koreaHolidaysJson from 'app/holidays/holidays.json';

import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { HolidayCalendar } from '~/components/HolidayCalander';
import { DatePickerWithRange } from '~/components/DatePickerWithRange';
import SMSTemplateSwitcher from './_components/SMSTemplateSwitcher';
import TemplateParser from './_components/TemplateParser';
import { EnvelopeOpenIcon, GearIcon, ReloadIcon } from '@radix-ui/react-icons';
import { getDatesBetween, templateMessageInjector } from './utils';
import { createClient } from '@supabase/supabase-js';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { Database, Json } from '~/types/supabase';
import { CourseType } from '~/types/collection';
import { DayInString } from '~/types/day';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import {
  ResponsiveDrawerDialog,
  ResponsiveDrawerDialogButton,
} from '~/components/ResponsiveDrawerDialog';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { parseCourseSchedules } from '../$businessId.classes/_components/EditClassSheet';
import { getStudentsSearchParams } from '~/helper/students.helper';
import { getManyStudents } from '~/server/students/students.server';
import { getAllCourses } from '~/server/courses/courses.server';
import { getAllTemplates } from '~/server/templates/templates.server';
import StudentsDataTable from '~/components/students/StudentsTable';
import {
  ClassesWithPayment,
  SuperEasySmsColumns,
  SuperEasySmsStudentType,
  paymentColumn,
} from '~/components/students/SuperEasySmsColumns';
import { getStudentsPayments } from './helpers/studentsParser';
import { Responsive } from '@tsparticles/engine';
import TuitionFeeSettlement from '~/components/students/TuitionFeeSettlement';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const businessId = Number(params.businessId);

  if (Number.isNaN(businessId)) {
    return redirect('/403');
  }

  const { start, end, name } = getStudentsSearchParams(request.url);

  const { students } = await getManyStudents({
    businessId,
    range: { start: Number(start), end: Number(end) },
    parmas: {
      name,
    },
  });

  const { courses } = await getAllCourses({ businessId });

  const { templates } = await getAllTemplates({ businessId });

  return {
    students: students,
    classes: courses,
    templates: templates,
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

const BILLING_METHODS = [
  { id: 'RANGE', name: '기간별 고정금액' },
  { id: 'PER_CLASS', name: '회차별 금액' },
];

function SuperEasySms() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { students, templates } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  });

  const [billingMethod, setBillingMethod] = useState<'RANGE' | 'PER_CLASS'>(
    'RANGE'
  );
  const [holidays, setHolidays] = React.useState<Date[]>([]);

  function insertNationalHolidays() {
    if (!date?.from || !date.to) {
      return;
    }

    const holidaysAsDates = nationalHolidays.map(
      (holiday) => new Date(holiday)
    );

    const filteredHolidays = holidaysAsDates.filter(
      (holiday) => holiday >= date.from! && holiday <= date.to!
    );

    setHolidays((prev) => {
      const newHolidays = filteredHolidays.filter(
        (newHoliday) =>
          !prev.some(
            (prevHoliday) => prevHoliday.getTime() === newHoliday.getTime()
          )
      );

      return prev.concat(newHolidays);
    });
  }

  const [selectedTemplateId, setSelectedTemplateId] = React.useState<
    number | null
  >(null);

  const selectedTemplate = templates.find(
    (each) => each.id === selectedTemplateId
  );

  function onClickTemplate(id: number) {
    setSelectedTemplateId(id);
  }

  const payments =
    date && getStudentsPayments(students, { dateRange: date, holidays });

  const currentSettlementStudentId = searchParams.get('studentId');
  const openStudentSettlementModal = !!currentSettlementStudentId;
  const currentStudentSettlement =
    payments?.[Number(currentSettlementStudentId)];

  const currentStudent = students.find(
    (stu) => stu.id === Number(currentSettlementStudentId)
  );

  const messageTemplate =
    selectedTemplate?.template &&
    JSON.parse(selectedTemplate.template as string);

  const message =
    messageTemplate &&
    currentStudent &&
    currentStudentSettlement &&
    templateMessageInjector(messageTemplate.content, {
      학생이름: currentStudent.name,
      정산시작일: date?.from ? format(date.from, 'PPP', { locale: ko }) : 'N/A',
      정산종료일: date?.to ? format(date.to, 'PPP', { locale: ko }) : 'N/A',
      정산금액: new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
      }).format(currentStudentSettlement.totalPriceForMonthlyPay),
    });

  return (
    <>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Students</h2>
          <p className='text-muted-foreground'>정산 / 문자템플릿 / SMS</p>
        </div>

        <div className='flex items-center space-x-2'>
          <ResponsiveDrawerDialogButton
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
                  <Label>정산 방식</Label>
                  <Select
                    onValueChange={setBillingMethod}
                    defaultValue={billingMethod}
                  >
                    <SelectTrigger className='mt-2'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BILLING_METHODS.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          <div className='text-left'> {method.name}</div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {billingMethod === 'PER_CLASS' && (
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
                      fromDate={date?.from}
                      toDate={date?.to}
                    />
                  </div>
                )}

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
        <StudentsDataTable data={students} extraColumns={[paymentColumn]} />
      </div>

      {currentStudentSettlement && currentStudent && (
        <ResponsiveDrawerDialog
          isOpen={openStudentSettlementModal}
          title={'학생 정산'}
          description={'정산 정정산'}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setSearchParams('studentId', undefined);
            }
          }}
          content={
            <TuitionFeeSettlement
              settlementInfo={currentStudentSettlement}
              message={message}
              student={currentStudent}
            />
          }
          footer={
            <div className='flex text-right font-medium items-center gap-2'>
              <Button disabled>Kakao</Button>

              <a href={`sms:${currentStudent.phoneNumber}&body=${message}`}>
                <Button>
                  <EnvelopeOpenIcon className='mr-2 h-4 w-4' /> SMS
                </Button>
              </a>
            </div>
          }
        />
      )}
    </>
  );
}

export default SuperEasySms;
