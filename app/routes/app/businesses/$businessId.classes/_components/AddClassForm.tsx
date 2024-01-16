import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { SAMPLE_CLASS_IMGS } from '../_mockdata';

interface FormDataType {
  id: keyof AppearanceFormValues;
  label: string;
  defaultLabel: string | number;
  description?: string;
  type: string;
}
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
  // {
  //   label: 'coverImg',
  //   defaultLabel: SAMPLE_CLASS_IMGS[0].imgSrc,
  //   id: 'coverImg',
  //   type: 'image',
  // },
  {
    label: 'priceDescription',
    defaultLabel: 'priceDescription...',
    type: 'text',
    id: 'priceDescription',
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
  coverImg: z.string({
    required_error: 'Please select a img or upload.',
  }),
});

const defaultValues: Partial<AppearanceFormValues> = {
  coverImg: SAMPLE_CLASS_IMGS[0].name,
  name: '',
  description: '',
  teacher: '',
  price: 100,
  priceDescription: '',
};

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

function AddClassForm({ className }: React.ComponentProps<'form'>) {
  // const { addClass } = useClass();

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues,
  });

  function onSubmit(formValues: AppearanceFormValues) {
    console.log('submitted');
    // addClass({ ...formValues, id: new Date().toString() });
  }

  function numberTypeOverride(each: FormDataType) {
    return (
      each.type === 'number' && form.register(each.id, { valueAsNumber: true })
    );
  }

  return (
    <Form {...form}>
      <form
        className={cn('grid items-start gap-4', className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {CLASS_FORM_DATA.map((each) => (
          <FormField
            key={each.id}
            control={form.control}
            name={each.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{each.label}</FormLabel>
                <FormControl>
                  <Input
                    className='focus-visible:ring-1 focus-visible:ring-offset-0'
                    placeholder={each.defaultLabel.toString()}
                    type={each.type}
                    {...field}
                    {...numberTypeOverride(each)}
                  />
                </FormControl>
                <FormDescription>{each.description}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <ImgFormField form={form} />
        <Button type='submit'>Save changes</Button>
      </form>
    </Form>
  );
}

function ImgFormField({ form }: { form: any }) {
  return (
    <FormField
      control={form.control}
      name='coverImg'
      render={({ field }) => (
        <FormItem className='space-y-1'>
          <FormLabel>Cover Image</FormLabel>
          <FormDescription>Select the cover image for class.</FormDescription>
          <FormMessage />
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className='grid pt-2'
          >
            <ScrollArea>
              <div className='flex space-x-4 pb-4'>
                {SAMPLE_CLASS_IMGS.map((img) => {
                  return (
                    <FormItem className='w-[150px]' key={img.name}>
                      <FormLabel className='[&:has([data-state=checked])>div]:border-primary'>
                        <FormControl>
                          <RadioGroupItem
                            value={img.imgSrc}
                            className='sr-only'
                          />
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
        </FormItem>
      )}
    />
  );
}
export default AddClassForm;
