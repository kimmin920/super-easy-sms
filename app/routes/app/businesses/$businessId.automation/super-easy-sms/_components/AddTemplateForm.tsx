import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import TemplateEditorTipTap from './templateEditor';
import TEMPLATE_MOCK_CONTENT from './templateEditor/template.mock.json';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useSubmit } from '@remix-run/react';
import { FormEvent, useRef } from 'react';

const schema = z.object({
  title: z
    .string({
      required_error: 'name is required',
      invalid_type_error: 'name is required',
    })
    .min(1),
  template: z.object({
    type: z.string(),
    content: z.array(
      z.object({
        type: z.string(),
        content: z
          .array(
            z.object({
              type: z.string(),
              text: z.string().optional(),
              attrs: z
                .object({ id: z.string(), label: z.string().nullable() })
                .optional(),
            })
          )
          .optional(),
      })
    ),
  }),
});

type SchemaFormValues = z.infer<typeof schema>;

const defaultValues: Partial<SchemaFormValues> = {
  title: '',
  template: TEMPLATE_MOCK_CONTENT,
};

interface Props {
  close: () => void;
}

function AddTemplateForm({ close }: Props) {
  const form = useForm<SchemaFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const formRef = useRef<HTMLFormElement>(null);

  const submit = useSubmit();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formRef.current) {
      return;
    }

    const formData = new FormData(formRef.current);
    const template = form.getValues('template');

    formData.set('template', JSON.stringify(template));
    submit(formData, { method: 'POST', action: '' });
    close();
    return true;
  }

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action=''
        method='post'
        className='grid items-start gap-4'
        onSubmit={onSubmit}
      >
        <FormField
          control={form.control}
          name={'title'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{'title'}</FormLabel>
              <FormControl>
                <Input
                  className='focus-visible:ring-1 focus-visible:ring-offset-0'
                  placeholder={'title placeholder'}
                  type='text'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={'template'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{'template'}</FormLabel>
              <FormControl>
                <div className='rounded-md border px-3 py-1 max-h-52 overflow-y-auto'>
                  <TemplateEditorTipTap
                    defaultContent={field.value}
                    onChange={field.onChange}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button variant='outline' onClick={close}>
            Cancel
          </Button>
          <Button type='submit'>Continue</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default AddTemplateForm;
