import { Input } from '@/components/ui/input';
import { Form as RemixForm } from '@remix-run/react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type Props = {
  businessName: string;
  businessId: number;
};

function DeleteBusinessForm({ businessId, businessName }: Props) {
  const formSchema = z.object({
    text: z.literal(`delete ${businessName}`, {
      errorMap: (error) => {
        return {
          message: '메세지가 일치하지 않습니다.',
        };
      },
    }),
  });

  type AppearanceFormValues = z.infer<typeof formSchema>;

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const isValid = form.formState.isValid;

  return (
    <Form {...form}>
      <RemixForm method='post' className='w-[300px]'>
        <input name='id' hidden value={businessId} />
        <FormField
          control={form.control}
          name='text'
          render={({ field }) => (
            <FormItem>
              <FormLabel>message</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  name='text'
                  placeholder='shadcn'
                  onChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormDescription>
                &quot;delete {businessName}&quot; 입력 후 삭제버튼을 눌러주세요.
              </FormDescription>
              <FormMessage />

              <Button
                variant='destructive'
                type='submit'
                name='_action'
                value='delete'
                disabled={!isValid}
              >
                Delete
              </Button>
            </FormItem>
          )}
        />
      </RemixForm>
    </Form>
  );
}

export default DeleteBusinessForm;
