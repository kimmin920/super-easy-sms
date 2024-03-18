import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { forwardRef } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type RadioOption = {
  value: string;
  label: string;
  disabled: boolean;
};
const RadioFormItem = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & {
    options: RadioOption[];
  }
>(({ className, options, ...props }, ref) => {
  return (
    <FormItem>
      <FormLabel>{props['aria-label']}</FormLabel>

      <FormControl>
        <RadioGroup
          ref={ref}
          onValueChange={props.onValueChange}
          defaultValue={props.value}
          name={props.name}
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={cn('flex items-center space-x-2', className)}
            >
              <RadioGroupItem
                value={option.value}
                id={option.value}
                disabled={option.disabled}
              />
              <Label htmlFor={option.value}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </FormControl>
      <FormDescription>{props['aria-description']}</FormDescription>
      <FormMessage />
    </FormItem>
  );
});

RadioFormItem.displayName = 'RadioFormItem';

export default RadioFormItem;

{
  /* <>
  <label>
    input
      type='radio'
      value='Email'
      checked={field.value === 'Email'}
      onChange={field.onChange}
    />{' '}
    Email
  </label>
  <label>
    <input
      type='radio'
      value='Phone'
      checked={field.value === 'Phone'}
      onChange={field.onChange}
    />{' '}
    Phone
  </label>
  <label>
    <input
      type='radio'
      value='SMS'
      checked={field.value === 'SMS'}
      onChange={field.onChange}
    />{' '}
    SMS
  </label>
</>; */
}
