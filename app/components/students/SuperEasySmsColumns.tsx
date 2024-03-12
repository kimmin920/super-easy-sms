import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EnvelopeOpenIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useNavigate } from '@remix-run/react';
import { ColumnDef } from '@tanstack/react-table';

import { ClassHoverCard } from '~/routes/app/businesses/$businessId.automation.super-easy-sms/_components/ClassHoverCard';
import { CourseType, StudentWithCourse } from '~/types/collection';

type Status = 'success' | 'pending' | 'idle' | 'loading';

export interface ClassesWithPayment extends CourseType {
  activeClassDates: Date[];
  priceOfCounts: number;
}

export interface SuperEasySmsStudentType extends StudentWithCourse {
  totalPrice: number;
  status: Status;
  classesWithPayment: ClassesWithPayment[];
  message: string;
}

export const SuperEasySmsColumns: ColumnDef<StudentWithCourse>[] = [
  {
    accessorKey: 'classesWithPayment',
    header: 'classes',
    cell: ({ row }) => {
      const classes: ClassesWithPayment[] = row.getValue('classesWithPayment');

      return classes.map((eachClass) => (
        <ClassHoverCard key={eachClass.id} classWithPayment={eachClass} />
      ));
    },
  },
  {
    accessorKey: 'totalPrice',
    header: () => <div className='text-right'>totalPrice</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalPrice'));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat('kr-KR', {
        style: 'currency',
        currency: 'KRW',
      }).format(amount);

      return <div className='text-right font-medium'>{formatted}</div>;
    },
  },
  {
    accessorKey: 'message',
    header: () => <></>,
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className='text-right font-medium'>
          <a
            href={`sms:${row.getValue('phoneNumber')}&body=${row.getValue(
              'message'
            )}`}
          >
            <Button>
              <EnvelopeOpenIcon className='mr-2 h-4 w-4' /> SMS
            </Button>
          </a>
        </div>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <DotsHorizontalIcon className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(payment.id.toString())
              }
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const paymentColumn: ColumnDef<StudentWithCourse> = {
  id: 'payment-action',
  enableHiding: false,
  cell: ({ row }) => {
    const student = row.original;

    return (
      <div className='w-full flex justify-end'>
        <TuitionFeeSettlementButton id={student.id} />
      </div>
    );
  },
};

function TuitionFeeSettlementButton({ id }: { id: number }) {
  const navigate = useNavigate();

  function onClickButton() {
    navigate(`?studentId=${id}`);
  }

  return <Button onClick={onClickButton}>정산하기</Button>;
}
