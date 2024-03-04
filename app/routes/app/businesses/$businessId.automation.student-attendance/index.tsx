import { ActionFunction, json } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import { sendMessageBySolapi } from '~/services/solapi-message.server';

export const action: ActionFunction = async () => {
  const data = await sendMessageBySolapi();
  return json(data);
};

function StudentAttendancePage() {
  return (
    <div className='h-full'>
      <Outlet />
    </div>
  );
}

export default StudentAttendancePage;
