'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Form as RemixForm, Link } from '@remix-run/react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BusinessType } from '~/types/collection';

const profileFormSchema = z.object({
  id: z.number().readonly(),
  name: z.string().min(1).max(20),
  plan: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type BusinessFormProps = {
  business: BusinessType;
};

export function BusinessForm({ business }: BusinessFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: business,
    mode: 'onChange',
  });

  return (
    <RemixForm className='space-y-8' method='post'>
      <Form {...form}>
        <input hidden name='id' value={form.getValues('id')} />
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={field.onChange}
                  defaultValue={field.value}
                />
              </FormControl>
              <FormDescription>
                This is public display name of your business.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='plan'
          render={({ field }) => (
            <FormItem>
              <FormLabel>plan</FormLabel>
              <Select
                name='plan'
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a verified plan' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='normal'>normal</SelectItem>
                  <SelectItem value='pro'>pro</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage verified plan addresses in your
                <Link to='/examples/forms'>plan settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>Update business</Button>
      </Form>
    </RemixForm>
  );
}

export default BusinessForm;
