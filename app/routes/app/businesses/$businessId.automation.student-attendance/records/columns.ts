'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Message } from 'coolsms-node-sdk';
import { format, formatDate } from 'date-fns';

export type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

export const columns: ColumnDef<Message>[] = [
  {
    accessorKey: 'status',
    header: '상태',
  },
  {
    accessorKey: 'statusCode',
    header: '상태코드',
    cell: ({ cell }) => {
      const parsedStatus = smsStatusParser(cell.getValue());

      return parsedStatus;
    },
  },
  {
    accessorKey: 'reason',
    header: '발송결과',
  },
  {
    accessorKey: 'dateCreated',
    header: '생성일',
    cell: ({ cell }) => {
      const createdAt = cell.getValue();

      return format(createdAt, 'MM-dd hh:mm a');
    },
  },
  {
    accessorKey: 'to',
    header: '수신번호',
  },
  {
    accessorKey: 'type',
    header: '타입',
  },
  {
    accessorKey: 'text',
    header: '내용',
  },
];

function smsStatusParser(code: string) {
  switch (code) {
    case '4000':
      return '성공';
    case '3046':
      return '발송실패';
    default:
      return code;
  }
}
