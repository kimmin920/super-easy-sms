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

const NormalInputFormItem = forwardRef<HTMLInputElement, InputProps>(
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
            type={props.type}
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

NormalInputFormItem.displayName = 'NormalInputFormItem';

export default NormalInputFormItem;
