import { ColumnDef } from '@tanstack/react-table';
import { CourseType, StudentWithCourse } from '~/types/collection';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Form } from '@remix-run/react';

export const StudentsDataTableColumns: ColumnDef<StudentWithCourse>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'active',
    header: 'Status',
    cell: ({ row }) => (
      <div className='capitalize'>
        {row.getValue('active') === true ? '재원생' : '퇴원생(?)'}
      </div>
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <CaretSortIcon className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='capitalize'>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <div className='lowercase'>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'phone_number',
    header: 'Phone number',
    cell: ({ row }) => {
      return <div>{row.getValue('phone_number')}</div>;
    },
  },
  {
    accessorKey: 'courses',
    header: 'Courses',
    cell: ({ row }) => {
      const courses: CourseType[] = row.getValue('courses');
      return (
        <div className='flex h-5 items-center space-x-2 text-sm'>
          {courses.map((course, idx) => {
            return (
              <>
                {idx !== 0 && <Separator orientation='vertical' />}
                <div>{course.name}</div>
              </>
            );
          })}
        </div>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row, onClickEdit, onClickDelete }) => {
      const studentId = row.original.id;
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
            <DropdownMenuItem onClick={() => onClickEdit(studentId)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Form method='post'>
                <input hidden name='id' value={studentId} />
                <button type='submit' name='_action' value='delete'>
                  Delete
                </button>
              </Form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
