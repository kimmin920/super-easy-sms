import { CalendarIcon } from '@radix-ui/react-icons';

import { ko } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { ClassesWithPayment } from './StudentsDataTable';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Props {
  classWithPayment: ClassesWithPayment;
}

export function ClassHoverCard({ classWithPayment }: Props) {
  const {
    name,
    activeClassDates,
    price,
    priceDescription,
    priceOfCounts,
    coverImgSrc,
    classCount,
    created_at,
  } = classWithPayment;

  const pricePerClass = price / classCount;

  return (
    <HoverCard>
      <HoverCardTrigger asChild className='bg-muted p-1 h-7 mr-1'>
        <Button variant='link'>{name}</Button>
      </HoverCardTrigger>
      <HoverCardContent className='w-85'>
        <div className='flex justify-between space-x-4'>
          <div
            className={cn('overflow-hidden rounded-md w-[150px] bg-cover')}
            style={{ backgroundImage: `url(${coverImgSrc})` }}
          />

          <div className='space-y-1'>
            <h4 className='text-sm font-semibold'>{name}</h4>
            <p className='text-sm'>수업 횟수: {activeClassDates.length}</p>
            <p className='text-sm'>
              수업 날짜:
              <ol className='list-inside list-decimal'>
                {formatDateList(activeClassDates).map((each) => (
                  <li
                    key={each}
                    className='text-center text-xs text-muted-foreground'
                  >
                    {each}
                  </li>
                ))}
              </ol>
            </p>
            <p className='text-sm'>
              회당 가격: {getFormattedKRW(pricePerClass)}
            </p>
            <p className='text-sm'>총 가격 {getFormattedKRW(priceOfCounts)}</p>

            <div className='flex items-center pt-2'>
              <CalendarIcon className='mr-2 h-4 w-4 opacity-70' />{' '}
              <span className='text-xs text-muted-foreground'>
                Created at {format(created_at, 'PPP', { locale: ko })}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

const formatDateList = (dates: Date[]) => {
  const formattedDates = dates.map((date) => format(date, 'MMM dd'));
  return formattedDates;
};

const getFormattedKRW = (amount: number) => {
  return new Intl.NumberFormat('kr-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
};
