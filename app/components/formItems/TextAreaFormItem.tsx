import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea, TextareaProps } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

const TextAreaFormItem = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <FormItem>
        <FormLabel>{props['aria-label']}</FormLabel>
        <FormControl>
          <Textarea
            ref={ref}
            className={cn(
              'focus-visible:ring-1 focus-visible:ring-offset-0',
              className
            )}
            placeholder={'place-holder'}
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

TextAreaFormItem.displayName = 'TextAreaFormItem';

export default TextAreaFormItem;
