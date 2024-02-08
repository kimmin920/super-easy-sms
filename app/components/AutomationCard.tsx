import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from './Icons';
import {
  CalendarIcon,
  ChatBubbleIcon,
  EnvelopeClosedIcon,
  GridIcon,
} from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

type AutomationCardProps = {
  title: string;
  contentText: string;
  description: string;
  icon: string;
  disabled: boolean;
};
function AutomationCard({
  title,
  contentText,
  description,
  icon,
  disabled,
}: AutomationCardProps) {
  return (
    <Card aria-disabled={disabled} className='relative'>
      <div
        className={cn(
          disabled &&
            'rounded-xl cursor-not-allowed absolute backdrop-opacity-10 backdrop-invert bg-white/30 w-full h-full'
        )}
      />
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {icon === 'dollor' && <Icons.dollor />}
        {icon === 'people' && <Icons.people />}
        {icon === 'card' && <Icons.card />}
        {icon === 'vital' && <Icons.vital />}
        {icon === 'calendar' && <CalendarIcon />}
        {icon === 'email' && <EnvelopeClosedIcon />}
        {icon === 'chat' && <ChatBubbleIcon />}
        {icon === 'grid' && <GridIcon />}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{contentText}</div>
        <p className='my-1 text-xs text-muted-foreground'>{description}</p>
      </CardContent>
    </Card>
  );
}

export default AutomationCard;
