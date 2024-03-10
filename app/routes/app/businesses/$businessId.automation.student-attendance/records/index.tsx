import { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getMessages } from '~/services/solapi.server';
import { DataTable } from './DataTable';
import { columns } from './columns';
import { GetMessagesResponse, Message } from 'coolsms-node-sdk';

export const loader: LoaderFunction = async () => {
  const data = await getMessages();

  return data;
};

function AttendanceRecordsPage() {
  const data: GetMessagesResponse = useLoaderData<typeof loader>();
  console.log(data);
  const messageList = Object.values(data.messageList);

  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={messageList} />
    </div>
  );
}

export default AttendanceRecordsPage;
