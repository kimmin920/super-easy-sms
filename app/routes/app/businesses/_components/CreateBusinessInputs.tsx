import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CreateBusinessFormInputs() {
  return (
    <div className='w-full'>
      <div className='space-y-4 py-2 pb-4'>
        <div className='space-y-2'>
          <input
            hidden
            name='user_id'
            value={'8f56d325-8a9a-4215-9b16-11d4b3e1ac79'}
          />
          <Label htmlFor='name'>Name</Label>
          <Input id='name' name='name' placeholder='학원이름..' />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='plan'>Subscription plan</Label>
          <Select name='plan'>
            <SelectTrigger>
              <SelectValue placeholder='Select a plan' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='free'>
                <span className='font-medium'>Free</span> -{' '}
                <span className='text-muted-foreground'>
                  Trial for two weeks
                </span>
              </SelectItem>
              <SelectItem value='pro'>
                <span className='font-medium'>Pro</span> -{' '}
                <span className='text-muted-foreground'>$9/month per user</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
