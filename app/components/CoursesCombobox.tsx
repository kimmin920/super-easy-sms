import { Button } from '@/components/ui/button';
import { FormControl } from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

import { CourseType } from '~/types/collection';

type CoursesComboboxProps = {
  courses: CourseType[];
  checkedCourses: number[];
  className?: string;
  onClickCourse: (id: number) => void;
};

function CoursesCombobox({
  courses,
  checkedCourses,
  className,
  onClickCourse,
}: CoursesComboboxProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant='outline'
            role='combobox'
            className={cn(
              'justify-between',
              'text-muted-foreground',
              className
            )}
          >
            <span className='truncate'>
              {checkedCourses
                .map((checkedId) => {
                  const course = courses.find(
                    (each) => each.id === checkedId
                  ) as CourseType;

                  if (!course) {
                    return 'N/A';
                  }

                  return course.name;
                })
                .join(', ')}
            </span>

            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className='w-[250px] p-0'>
        <Command>
          <CommandInput placeholder='Search Course...' className='h-9' />
          <CommandEmpty>No Course found.</CommandEmpty>
          <CommandGroup>
            {courses.map((course) => (
              <CommandItem
                value={course.id.toString()}
                key={course.id}
                onSelect={() => onClickCourse(course.id)}
              >
                {course.name}
                <CheckIcon
                  className={cn(
                    'ml-auto h-4 w-4',
                    checkedCourses.includes(course.id)
                      ? 'opacity-100'
                      : 'opacity-0'
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default CoursesCombobox;
