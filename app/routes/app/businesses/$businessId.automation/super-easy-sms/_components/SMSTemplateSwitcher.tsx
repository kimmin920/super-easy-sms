'use client';

import * as React from 'react';
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
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

// NOTE: this is mock
export const messageTemplates = [
  {
    label: 'template A',
    value: '1',
    message:
      '${학생} 어머니, 안녕하세요! 즐거운 돈내는 날입니다. ${학생}의 이번 정산기간 ${시작일} ~ ${종료일}의 비용은 ${금액} 입니다. 즐거운 한가위 보내세요 호호',
  },
  {
    label: 'template B',
    value: '2',
    message:
      '${학생} 어머니, ${학생}의 이번 정산기간 ${시작일} ~ ${종료일}의 비용은 ${금액} 입니다.',
  },
  {
    label: 'template C',
    value: '3',
    message:
      '${학생} 어머니, ${학생}의 이번 정산기간 ${시작일} ~ ${종료일}의 비용은 ${금액} 입니다.',
  },
];

const switcherGroup = [
  {
    label: 'SMS Templates',
    templates: messageTemplates,
  },
];

type Business = (typeof switcherGroup)[number]['templates'][number];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TemplateSwitcherProps extends PopoverTriggerProps {
  selectedBusinessId: string;
}

export default function SMSTemplateSwitcher({
  selectedBusinessId,
  className,
}: TemplateSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewBusinessDialog, setShowNewBusinessDialog] =
    React.useState(false);

  const [selectedBusiness, setSelectedBusiness] = React.useState<Business>(
    messageTemplates.find(
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
                {messageTemplates.map((template) => (
                  <CommandItem
                    key={template.value}
                    onSelect={() => {
                      setSelectedBusiness(template);
                      setOpen(false);
                    }}
                    className='text-sm'
                  >
                    {template.label}
                    <CheckIcon
                      className={cn(
                        'ml-auto h-4 w-4',
                        selectedBusiness.value === template.value
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
                    Create Template
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Template</DialogTitle>
          <DialogDescription>
            Add a new Template to manage products and customers.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className='space-y-4 py-2 pb-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Template name</Label>
              <Input id='name' placeholder='Acme Inc.' />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='plan'>Subscription plan</Label>
              <Select>
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
      </DialogContent>
    </Dialog>
  );
}
