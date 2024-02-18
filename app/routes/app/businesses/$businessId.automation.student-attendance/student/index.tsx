import { Button } from '@/components/ui/button';
import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node';
import { useFetcher, useLoaderData, useLocation } from '@remix-run/react';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import NumericKeyboard from '~/components/NumericKeyboard';
import { StudentType } from '~/types/collection';
import { Database } from '~/types/supabase';
import { checkLastFourDigits } from './utils';
import { sendOneMessage } from '~/services/solapi.server';

export const loader: LoaderFunction = async ({ params }) => {
  const businessId = params.businessId;
  console.log('called loader agagin.');

  if (!businessId) {
    return redirect('/404');
  }

  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select(`*, courses: classes(*)`)
    .eq('business_id', businessId);

  if (studentsError) {
    return redirect('/500');
  }

  return {
    students: students,
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  const student: StudentType = JSON.parse(values.student);

  const data = await sendOneMessage({
    from: '01097690373',
    to: student.phoneNumber!,
    text: `${student.name} 등원했습니다.`,
  });

  // NOTE: 성공했는지 여부 검사

  return {
    success: true,
  };
};

function StudentAttendanceStudentPage() {
  const location = useLocation();
  const { students }: { students: StudentType[] } =
    useLoaderData<typeof loader>();

  const [inputValue, setInputValue] = useState('');

  const [selectedStudents, setSelectedStudents] = useState<StudentType[]>([]);

  const fetcher = useFetcher();
  const { data } = fetcher;

  useEffect(() => {
    if (data?.success) {
      setSelectedStudents([]);
      setInputValue('');
    }
  }, [data]);

  const onChangeDigits = (digits: string) => {
    if (digits.length < 4) {
      setSelectedStudents([]);
      return;
    }

    const filteredStudents = students.filter(
      (student) =>
        student.phoneNumber && checkLastFourDigits(student.phoneNumber, digits)
    );

    setSelectedStudents(filteredStudents);
  };

  return (
    <div className='h-full w-full flex flex-col justify-end items-center md:max-w-[500px] mx-auto'>
      <fetcher.Form method='POST' className='w-full'>
        {selectedStudents.map((student) => (
          <Button
            key={student.id}
            type='submit'
            name='student'
            value={JSON.stringify(student)}
            className='mb-4 w-full p-3 text-lg h-fit'
          >
            {student.name} ({student.birthday}) 등원
          </Button>
        ))}
      </fetcher.Form>

      <NumericKeyboard
        inputValue={inputValue}
        setInputValue={setInputValue}
        onChangeDigits={onChangeDigits}
      />

      {/* <UserItem id={1} name={'김나은'} caption='hell' /> */}
    </div>
  );
}

export default StudentAttendanceStudentPage;
