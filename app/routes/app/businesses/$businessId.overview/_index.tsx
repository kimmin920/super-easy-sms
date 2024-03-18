import StudentForm from '~/components/students/StudentForm';

function Overview() {
  return (
    <>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>Dashboard</h2>
        <p className='text-muted-foreground'>
          이 부분은 대시보드로, 전체 학생과 수업의 개요 등 중요 지표를 보는
          페이지로 업데이트 될 예정입니다.
        </p>
      </div>

      {/* TEST for EDIT */}
      <StudentForm
        defaultValues={{
          name: '김민우',
          email: 'aa@aa.com',
          phoneNumber: '01097690373',
          notificationType: 'SMS',
          birthday: new Date('1992-09-20'),
        }}
        onSubmit={console.log}
      />
    </>
  );
}

export default Overview;
