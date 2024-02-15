'use client';

import * as React from 'react';
import {
  CaretSortIcon,
  CheckIcon,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { StudentWithCourse } from '~/types/collection';


type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StudentsSwitcherProps extends PopoverTriggerProps {
  selectedStudentId: number | null;
  students: StudentWithCourse[];
  onClickTemplate: (id: number) => void;
}

export default function StudentsSwitcher({
  selectedStudentId,
  className,
  students,
  onClickTemplate,
}: StudentsSwitcherProps) {
  const [open, setOpen] = React.useState(false);


  const selectedTemplate = students.find(
    (each) => each.id === selectedStudentId
  );

  return (
    
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            aria-label='Select a template'
            className={cn('w-[200px] justify-between', className)}
          >
            {selectedTemplate?.name ?? '학생 선택'}
            <CaretSortIcon className='ml-auto h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] p-0'>
          <Command>
            <CommandList>
              <CommandInput placeholder='Search templates...' />
              <CommandEmpty>No Message found.</CommandEmpty>
              <CommandGroup heading='templates'>
                {students.map((template) => (
                  <CommandItem
                    key={template.id}
                    value={template.id.toString()}
                    onSelect={() => {
                      onClickTemplate(template.id);
                      setOpen(false);
                    }}
                    className='text-sm'
                  >
                    {template.name}
                    <CheckIcon
                      className={cn(
                        'ml-auto h-4 w-4',
                        selectedStudentId === template.id
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
          </Command>
        </PopoverContent>
      </Popover>

  );
}
