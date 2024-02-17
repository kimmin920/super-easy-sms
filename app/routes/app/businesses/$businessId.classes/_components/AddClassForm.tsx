import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { zodResolver } from '@hookform/resolvers/zod';
import { ControllerRenderProps, useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import React, { Fragment } from 'react';

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
import DaySelect from './DaySelect';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface FormDataType {
  id: keyof ClassFormValues;
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
    label: 'times',
    defaultLabel: '',
    type: 'fields',
    id: 'time',
  },
  // {
  //   label: 'classCount',
  //   defaultLabel: 'classCount...',
  //   type: 'number',
  //   id: 'classCount',
  // },
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
  billingFrequency: z.enum(['MONTHLY', 'WEEKLY', 'DAILY']),
  // classCount: z.number(),
  time: z.array(
    z.object({
      id: z.number(),
      day: z.enum([
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY',
      ]),
      startTime: z.string().datetime(),
      endTime: z.string().datetime(),
    })
  ),
});

const DEFAULT_VALUES: Partial<ClassFormValues> = {
  coverImgSrc: SAMPLE_CLASS_IMGS[0].imgSrc,
  name: '',
  description: '',
  teacher: '',
  price: 100,
  priceDescription: '',
  billingFrequency: 'MONTHLY',
  // classCount: 0,
  time: [{ id: 1, day: 'MONDAY', startTime: '09:00', endTime: '12:00' }],
};

export type ClassFormValues = z.infer<typeof appearanceFormSchema>;

interface AddClassFormProps extends React.ComponentProps<'form'> {
  actionType: 'create' | 'update';
  defaultValues?: Partial<ClassFormValues>;
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

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: defaultValues ?? DEFAULT_VALUES,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'time',
    rules: {
      minLength: 1,
    },
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
              render={({ field }) => {
                if (field.name === 'time') {
                  return (
                    <>
                      <Separator />
                      <div>
                        {/* className='rounded-lg border p-3 bg-muted */}
                        <input
                          name='scheduleCount'
                          hidden
                          value={fields.length}
                        />
                        <FormLabel>수업 스케쥴</FormLabel>
                        <p className='text-[0.8rem] text-muted-foreground'>
                          수업 스케쥴을 추가하고 요일과 시작/끝 시간을
                          설정하세요.
                        </p>

                        <div className='flex mt-2'>
                          <span className='w-[82px] mr-1 text-xs'>Day</span>
                          <span className='flex-1 mr-1 text-xs'>
                            Start time
                          </span>
                          <span className='flex-1 mr-1 text-xs'>End time</span>
                          <span className='w-[36px]'></span>
                        </div>

                        {fields.map((innerField, index) => {
                          return (
                            <Fragment key={innerField.id}>
                              <div className='flex mt-2'>
                                <DaySelect
                                  {...form.register(`time.${index}.day`)}
                                  defaultValue={innerField.day}
                                  onValueChange={field.onChange}
                                  className='flex-1 mr-1 text-sm'
                                />
                                <Input
                                  className='mr-1 focus-visible:ring-1 focus-visible:ring-offset-0'
                                  type='time'
                                  {...form.register(`time.${index}.startTime`)}
                                />
                                <Input
                                  className='mr-1 focus-visible:ring-1 focus-visible:ring-offset-0'
                                  type='time'
                                  {...form.register(`time.${index}.endTime`)}
                                />
                                <Button
                                  size='icon'
                                  type='button'
                                  variant='ghost'
                                  className='p-2'
                                  onClick={() => remove(index)}
                                >
                                  <Trash2 className='stroke-destructive' />
                                </Button>
                              </div>
                            </Fragment>
                          );
                        })}

                        <Button
                          type='button'
                          className='mr-auto mt-2'
                          variant='outline'
                          onClick={() =>
                            append({
                              id: fields.length,
                              day: 'MONDAY',
                              startTime: '09:00',
                              endTime: '12:00',
                            })
                          }
                        >
                          <PlusCircledIcon width={20} height={20} />
                          <span className='ml-1'>Add Day</span>
                        </Button>
                      </div>
                      <Separator />
                    </>
                  );
                }

                return (
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
                );
              }}
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
  field: ControllerRenderProps<ClassFormValues, keyof ClassFormValues>;
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
  field: ControllerRenderProps<ClassFormValues, keyof ClassFormValues>;
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
  field: ControllerRenderProps<ClassFormValues, keyof ClassFormValues>;
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
          <RadioGroupItem
            value={option.value}
            id={option.value}
            disabled={option.status === 'disabled'}
          />
          <Label htmlFor={option.value}>{option.label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}

export default AddClassForm;
