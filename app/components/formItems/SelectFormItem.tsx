import * as SelectPrimitive from '@radix-ui/react-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { forwardRef } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { CaretSortIcon } from '@radix-ui/react-icons';

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

const SelectFormItem = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    options: SelectOption[];
  }
>(({ className, options, ...props }, ref) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <FormItem>
      <FormLabel>{props['aria-label']}</FormLabel>

      <FormControl>
        {isDesktop ? (
          <Select name={props.name}>
            <SelectTrigger className={className}>
              <SelectValue ref={ref} placeholder={props['aria-placeholder']} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className='relative'>
            <div className='absolute flex h-9 w-full px-3 py-2 justify-end items-center'>
              <CaretSortIcon className='h-4 w-4 opacity-50' />
            </div>
            <select
              hidden
              name={props.name}
              multiple
              className='relative flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
            >
              <option hidden>{props['aria-placeholder']}</option>
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </FormControl>
      <FormDescription>{props['aria-description']}</FormDescription>
      <FormMessage />
    </FormItem>
  );
});

SelectFormItem.displayName = 'SelectFormItem';

export default SelectFormItem;
