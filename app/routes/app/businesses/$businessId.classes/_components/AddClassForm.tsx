import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { zodResolver } from '@hookform/resolvers/zod';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import React from 'react';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Form as RemixForm, useNavigation, useParams } from '@remix-run/react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { SAMPLE_CLASS_IMGS } from '~/constants/sampleImages';

interface FormDataType {
  id: keyof AppearanceFormValues;
  label: string;
  defaultLabel: string | number;
  description?: string;
  type: string;
  options?: OptionsType[];
}

interface OptionsType {
  value: string;
  status: 'enabled' | 'disabled';
  label: string;
}

const daysOptions: OptionsType[] = [
  { value: 'MONDAY', status: 'enabled', label: 'Monday' },
  { value: 'TUESDAY', status: 'enabled', label: 'Tuesday' },
  { value: 'WEDNESDAY', status: 'enabled', label: 'Wednesday' },
  { value: 'THURSDAY', status: 'enabled', label: 'Thursday' },
  { value: 'FRIDAY', status: 'enabled', label: 'Friday' },
  { value: 'SATURDAY', status: 'enabled', label: 'Saturday' },
  { value: 'SUNDAY', status: 'enabled', label: 'Sunday' },
];

const billingFrequencyOptions: OptionsType[] = [
  {
    value: 'MONTHLY',
    label: 'MONTHLY',
    status: 'enabled',
  },
  {
    value: 'WEEKLY',
    label: 'WEEKLY',
    status: 'disabled',
  },
  {
    value: 'DAILY',
    label: 'DAILY',
    status: 'disabled',
  },
];

const CLASS_FORM_DATA: FormDataType[] = [
  {
    label: 'name',
    defaultLabel: 'class name..',
    id: 'name',
    type: 'text',
  },
  {
    label: 'description',
    defaultLabel: 'description...',
    id: 'description',
    type: 'text',
  },
  {
    label: 'teacher',
    defaultLabel: 'teacher name...',
    type: 'text',
    id: 'teacher',
  },
  {
    label: 'price',
    defaultLabel: 0,
    id: 'price',
    type: 'number',
  },
  {
    label: 'coverImgSrc',
    defaultLabel: SAMPLE_CLASS_IMGS[0].imgSrc,
    id: 'coverImgSrc',
    type: 'image',
  },
  {
    label: 'priceDescription',
    defaultLabel: 'priceDescription...',
    type: 'text',
    id: 'priceDescription',
  },
  {
    label: 'billingFrequency',
    defaultLabel: 'billingFrequency...',
    type: 'radio',
    id: 'billingFrequency',
    options: billingFrequencyOptions,
  },
  {
    label: 'scheduledDays',
    defaultLabel: 'scheduledDays...',
    type: 'multiple-checkbox',
    id: 'scheduledDays',
    options: daysOptions,
  },
  {
    label: 'classCount',
    defaultLabel: 'classCount...',
    type: 'number',
    id: 'classCount',
  },
];

const appearanceFormSchema = z.object({
  name: z
    .string({
      required_error: 'name is required',
      invalid_type_error: 'name is required',
    })
    .min(1),
  description: z.string(),
  teacher: z.string(),
  price: z.number(),
  priceDescription: z.string(),
  coverImgSrc: z.string({
    required_error: 'Please select a img or upload.',
  }),
  scheduledDays: z.array(
    z.enum([
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY',
    ] as const)
  ),
  billingFrequency: z.enum(['MONTHLY', 'WEEKLY', 'DAILY']),
  classCount: z.number(),
});

const DEFAULT_VALUES: Partial<AppearanceFormValues> = {
  coverImgSrc: SAMPLE_CLASS_IMGS[0].imgSrc,
  name: '',
  description: '',
  teacher: '',
  price: 100,
  priceDescription: '',
  billingFrequency: 'MONTHLY',
  classCount: 0,
  scheduledDays: [],
};

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

interface AddClassFormProps extends React.ComponentProps<'form'> {
  actionType: 'create' | 'update';
  defaultValues?: Partial<AppearanceFormValues>;
  courseId?: number;
}
function AddClassForm({
  className,
  defaultValues,
  courseId,
  actionType,
}: AddClassFormProps) {
  const params = useParams();
  const businessId = params.businessId;
  const navigation = useNavigation();

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: defaultValues ?? DEFAULT_VALUES,
  });

  function numberTypeOverride(each: FormDataType) {
    return (
      each.type === 'number' && form.register(each.id, { valueAsNumber: true })
    );
  }

  const isSubmitLoading =
    navigation.state === 'submitting' || navigation.state === 'loading';
  return (
    <Form {...form}>
      <RemixForm
        action={`/app/businesses/${businessId}/classes`}
        method='post'
        className={cn('grid items-start gap-4', className)}
      >
        <input hidden name='id' value={courseId} />
        {CLASS_FORM_DATA.map((each) => {
          return (
            <FormField
              key={each.id}
              control={form.control}
              name={each.id}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{each.label}</FormLabel>
                  <FormControl>
                    {each.type === 'multiple-checkbox' ? (
                      <MultipleCheckbox
                        options={each.options ?? []}
                        field={field}
                      />
                    ) : each.type === 'radio' ? (
                      <RadioGroupInput
                        options={each.options ?? []}
                        field={field}
                      />
                    ) : each.id === 'coverImgSrc' ? (
                      <ImgFormField key={each.id} field={field} />
                    ) : (
                      <Input
                        className='focus-visible:ring-1 focus-visible:ring-offset-0'
                        placeholder={each.defaultLabel.toString()}
                        type={each.type}
                        {...field}
                        {...numberTypeOverride(each)}
                      />
                    )}
                  </FormControl>
                  <FormDescription>{each.description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
        <Button
          type='submit'
          name='_action'
          value={actionType}
          disabled={isSubmitLoading}
        >
          Save
        </Button>
      </RemixForm>
    </Form>
  );
}

function ImgFormField({
  field,
}: {
  field: ControllerRenderProps<
    AppearanceFormValues,
    keyof AppearanceFormValues
  >;
}) {
  if (typeof field.value !== 'string') {
    return <div>Error: field.value must be string for img form field</div>;
  }

  return (
    <RadioGroup
      onValueChange={field.onChange}
      defaultValue={field.value}
      className='grid pt-2'
      name={field.name}
    >
      <ScrollArea>
        <div className='flex space-x-4 pb-4'>
          {SAMPLE_CLASS_IMGS.map((img) => {
            return (
              <FormItem className='w-[150px]' key={img.name}>
                <FormLabel className='[&:has([data-state=checked])>div]:border-primary'>
                  <FormControl>
                    <RadioGroupItem value={img.imgSrc} className='sr-only' />
                  </FormControl>
                  <div className='rounded-md border-2 border-muted p-1'>
                    <img
                      alt={img.name}
                      className='object-cover h-auto w-auto aspect-square'
                      src={img.imgSrc}
                      height='100%'
                    />
                  </div>
                </FormLabel>
              </FormItem>
            );
          })}
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </RadioGroup>
  );
}

function MultipleCheckbox({
  field,
  options,
}: {
  field: ControllerRenderProps<
    AppearanceFormValues,
    keyof AppearanceFormValues
  >;
  options: OptionsType[];
}) {
  const { value } = field;

  if (!Array.isArray(value)) {
    return <>Error: value must be array for multiple checkbox</>;
  }

  return (
    <>
      <input type='text' hidden name={field.name} value={`{${field.value}}`} />

      {options.map((option) => (
        <div key={option.value} className='flex items-center space-x-2'>
          <Checkbox
            id={option.value}
            name={field.name + 'checkbox'}
            value={option.value}
            checked={value.includes(option.value)}
            onCheckedChange={(checked) => {
              return checked
                ? field.onChange([...value, option.value])
                : field.onChange(
                    value.filter((value: string) => value !== option.value)
                  );
            }}
          />
          <Label htmlFor={option.value}>{option.label}</Label>
        </div>
      ))}
    </>
  );
}

function RadioGroupInput({
  field,
  options,
}: {
  field: ControllerRenderProps<
    AppearanceFormValues,
    keyof AppearanceFormValues
  >;
  options: OptionsType[];
}) {
  if (typeof field.value !== 'string') {
    return <div>Error: field.value must be string for this Radio</div>;
  }

  return (
    <RadioGroup
      onValueChange={field.onChange}
      defaultValue={field.value}
      name={field.name}
    >
      {options.map((option) => (
        <div key={option.value} className='flex items-center space-x-2'>
          <RadioGroupItem value={option.value} id={option.value} />
          <Label htmlFor={option.value}>{option.label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}

export default AddClassForm;
