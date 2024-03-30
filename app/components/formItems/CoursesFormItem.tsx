import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import ResponsiveSelect, { SelectOption } from '../ResponsiveSelect';
import { Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddButton from '../AddButton';
import { Control, useFieldArray } from 'react-hook-form';
import { StudentFormType } from '../students/StudentForm';

interface Props {
  name: string;
  control: Control<StudentFormType>;
  'aria-label': string;
  'aria-placeholder': string;
  'aria-description': string;
  options: SelectOption[];
}

export default function CoursesFormItem(props: Props) {
  const { fields, append, remove, update } = useFieldArray<
    StudentFormType,
    'courseIds'
  >({
    control: props.control,
    name: 'courseIds',
  });

  return (
    <FormItem>
      <FormLabel>{props['aria-label']}</FormLabel>
      <FormDescription>{props['aria-description']}</FormDescription>
      <FormMessage />

      <FormControl>
        <>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className='flex flex-row justify-center items-center gap-2'
            >
              <ResponsiveSelect
                aria-placeholder={props['aria-placeholder']}
                name={props.name}
                value={field.value}
                options={props.options}
                onValueChange={(value) => update(index, { value })}
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => remove(index)}
              >
                <Trash2Icon className='text-destructive' size={16} />
              </Button>
            </div>
          ))}
        </>
      </FormControl>
      <AddButton
        type='button'
        className='text-xs h-7 mx-auto'
        label={'수업 추가'}
        onClick={() => append({ value: '' })}
      />
    </FormItem>
  );
}
