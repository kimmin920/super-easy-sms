import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input, InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export const phoneRegex = new RegExp(
  /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/
);

const PhoneNumberFormItem = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <FormItem>
        <FormLabel>{props['aria-label']}</FormLabel>
        <FormControl>
          <Input
            ref={ref}
            className={cn(
              'focus-visible:ring-1 focus-visible:ring-offset-0',
              className
            )}
            placeholder={'place-holder'}
            type='string'
            onChange={props.onChange}
            {...props}
          />
        </FormControl>
        <FormDescription>{props['aria-description']}</FormDescription>
        <FormMessage />
      </FormItem>
    );
  }
);

PhoneNumberFormItem.displayName = 'PhoneNumberFormItem';

export default PhoneNumberFormItem;
