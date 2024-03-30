import * as SelectPrimitive from '@radix-ui/react-select';

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { forwardRef } from 'react';
import ResponsiveSelect from '../ResponsiveSelect';

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
  return (
    <FormItem>
      <FormLabel>{props['aria-label']}</FormLabel>

      <FormControl>
        <ResponsiveSelect
          ref={ref}
          className={className}
          options={options}
          {...props}
        />
      </FormControl>
      <FormDescription>{props['aria-description']}</FormDescription>
      <FormMessage />
    </FormItem>
  );
});

SelectFormItem.displayName = 'SelectFormItem';

export default SelectFormItem;
