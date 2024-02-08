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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import AddTemplateForm from './AddTemplateForm';

// NOTE: this is mock
const switcherGroup = [
  {
    label: 'SMS Templates',
    templates: [],
  },
];

type Business = (typeof switcherGroup)[number]['templates'][number];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TemplateSwitcherProps extends PopoverTriggerProps {
  selectedTemplateId: number | null;
  messageTemplates: any[];
  onClickTemplate: (id: number) => void;
}

export default function SMSTemplateSwitcher({
  selectedTemplateId,
  className,
  messageTemplates,
  onClickTemplate,
}: TemplateSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewBusinessDialog, setShowNewBusinessDialog] =
    React.useState(false);

  const selectedTemplate = messageTemplates.find(
    (each) => each.id === selectedTemplateId
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
            aria-label='Select a template'
            className={cn('w-[200px] justify-between', className)}
          >
            {selectedTemplate?.title}
            <CaretSortIcon className='ml-auto h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] p-0'>
          <Command>
            <CommandList>
              <CommandInput placeholder='Search templates...' />
              <CommandEmpty>No Message found.</CommandEmpty>
              <CommandGroup heading='templates'>
                {messageTemplates.map((template) => (
                  <CommandItem
                    key={template.id}
                    onSelect={() => {
                      onClickTemplate(template.id);
                      setOpen(false);
                    }}
                    className='text-sm'
                  >
                    {template.title}
                    <CheckIcon
                      className={cn(
                        'ml-auto h-4 w-4',
                        selectedTemplateId === template.id
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

        <AddTemplateForm close={() => setShowNewBusinessDialog(false)} />
      </DialogContent>
    </Dialog>
  );
}
