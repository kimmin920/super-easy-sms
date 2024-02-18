import { ActionFunction, json } from '@remix-run/node';
import { Outlet, useFetcher } from '@remix-run/react';
import {
  fetchSolapi,
  sendMessageBySolapi,
} from '~/services/solapi-message.server';
import { sendOneMessage } from '~/services/solapi.server';
// import { SolapiMessageService } from '~/services/solapi.server';
// import { SolapiMessageService } from '../../../../services/solapi';

export const action: ActionFunction = async () => {
  // const data = await sendOneMessage();
  const data = await sendMessageBySolapi();

  //   console.log(res);

  //   return res;
  // }

  return json(data);
};

function StudentAttendancePage() {
  const fetcher = useFetcher();

  console.log(fetcher.data);

  return (
    <div className='h-full'>
      {/* <fetcher.Form method='post'>
        <button type='submit'>SEND MESSAGE</button>
      </fetcher.Form> */}

      <Outlet />
    </div>
  );
}

export default StudentAttendancePage;
