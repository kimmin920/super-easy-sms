'use client';

import * as React from 'react';
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Form, useNavigate, useParams } from '@remix-run/react';
import { businessesData } from '../data';

const switcherGroup = [
  {
    label: 'Businesses',
    businesses: businessesData,
  },
];

type Business = (typeof switcherGroup)[number]['businesses'][number];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface BusinessSwitcherProps extends PopoverTriggerProps {
  selectedBusinessId: string;
}

export default function BusinessSwitcher({
  selectedBusinessId,
  className,
}: BusinessSwitcherProps) {
  const params = useParams();

  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [showNewBusinessDialog, setShowNewBusinessDialog] =
    React.useState(false);

  const [selectedBusiness, setSelectedBusiness] = React.useState<Business>(
    businessesData.find(
      (datum) => datum.value === selectedBusinessId
    ) as Business
  );

  return (
    <Dialog
      open={showNewBusinessDialog}
      onOpenChange={setShowNewBusinessDialog}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            aria-label='Select a business'
            className={cn('w-[200px] justify-between', className)}
          >
            <Avatar className='mr-2 h-5 w-5'>
              <AvatarImage
                src={`https://avatar.vercel.sh/${selectedBusiness.value}.png`}
                alt={selectedBusiness.label}
                className='grayscale'
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {selectedBusiness.label}
            <CaretSortIcon className='ml-auto h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] p-0'>
          <Command>
            <CommandList>
              <CommandInput placeholder='Search business...' />
              <CommandEmpty>No Business found.</CommandEmpty>
              <CommandGroup heading='businesses'>
                {businessesData.map((business) => (
                  <CommandItem
                    key={business.value}
                    onSelect={() => {
                      setSelectedBusiness(business);
                      setOpen(false);
                      navigate(`${business.value}`);
                    }}
                    className='text-sm'
                  >
                    <Avatar className='mr-2 h-5 w-5'>
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${business.value}.png`}
                        alt={business.label}
                        className='grayscale'
                      />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    {business.label}
                    <CheckIcon
                      className={cn(
                        'ml-auto h-4 w-4',
                        selectedBusiness.value === business.value
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewBusinessDialog(true);
                    }}
                  >
                    <PlusCircledIcon className='mr-2 h-5 w-5' />
                    Create Business
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <DialogContent>
        <Form method='post' action={`/app/businesses/${params.businessId}`}>
          <DialogHeader>
            <DialogTitle>Create Business</DialogTitle>
            <DialogDescription>
              Add a new business to manage products and customers.
            </DialogDescription>
          </DialogHeader>
          <div>
            <div className='space-y-4 py-2 pb-4'>
              <div className='space-y-2'>
                <input
                  hidden
                  name='user_id'
                  value={'8f56d325-8a9a-4215-9b16-11d4b3e1ac79'}
                />
                <Label htmlFor='name'>Business name</Label>
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
                      <span className='text-muted-foreground'>
                        $9/month per user
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowNewBusinessDialog(false)}
            >
              Cancel
            </Button>
            <Button type='submit'>Continue</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
