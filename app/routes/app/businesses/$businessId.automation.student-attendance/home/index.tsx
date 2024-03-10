import { NavLink, useMatches } from '@remix-run/react';

const matchId =
  'routes/app/businesses/$businessId.automation.student-attendance/index';

function StudentAttendanceHomePage() {
  const matches = useMatches();
  const match = matches.find((match) => match.id === matchId)!;

  return (
    <div className='flex flex-col gap-2'>
      <NavLink to={match.pathname + '/student'}>
        <div className='gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent'>
          <div className='font-semibold'>출결번호 등/하원</div>
          <div className='line-clamp-2 text-xs text-muted-foreground'>
            출결번호를 이용하여 학생이 직접 등/하원을 하고 문자가 자동으로
            발송됩니다.
          </div>
        </div>
      </NavLink>

      <NavLink to={match.pathname + '/records'}>
        <div className='gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent'>
          <div className='font-semibold'>출결문자 발송기록</div>
          <div className='line-clamp-2 text-xs text-muted-foreground'>
            출결문자 발송기록을 확인할 수 있습니다.
          </div>
        </div>
      </NavLink>
    </div>
  );
}

export default StudentAttendanceHomePage;
