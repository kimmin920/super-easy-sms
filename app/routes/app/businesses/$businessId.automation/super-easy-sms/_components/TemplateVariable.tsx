import { CalendarIcon } from '@radix-ui/react-icons';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

type Props = {
  label: string;
};

export function TemplateVariable({ label }: Props) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild className='bg-muted p-1 h-7'>
        <Button variant='link'>@{label}</Button>
      </HoverCardTrigger>
      <HoverCardContent className='w-80'>
        <div className='flex justify-between space-x-4'>
          <div className='space-y-1'>
            <h4 className='text-sm font-semibold'>@{label}</h4>
            <p className='text-sm'>{label}의 실제 정보로 대체됩니다.</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
