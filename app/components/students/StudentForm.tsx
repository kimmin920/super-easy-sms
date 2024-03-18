import { Form as FormProvider, FormField } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import NormalInputFormItem from '../formItems/NormalFormItem';
import { phoneNumberRegex } from '~/constants/regex';
import TextAreaFormItem from '../formItems/TextAreaFormItem';
import RadioFormItem, { RadioOption } from '../formItems/RadioFormItem';
import { Button } from '@/components/ui/button';

const StudentFormSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }).min(5),
  name: z.string().min(1),
  phoneNumber: z.string().regex(phoneNumberRegex, 'Invalid PhoneNumber'),
  birthday: z.date({ coerce: true }),
  courseIds: z.array(z.number()).optional(),
  notificationType: z.enum(['Email', 'SMS', 'Kakao']),
  school: z.string().max(50).optional(),
  note1: z.string().max(200).optional(),
  note2: z.string().max(200).optional(),
});

export const NOTIFICATION_OPTIONS: RadioOption[] = [
  {
    value: 'SMS',
    label: 'SMS',
    disabled: false,
  },
  {
    value: 'Email',
    label: 'Email',
    disabled: true,
  },
  {
    value: 'Kakao',
    label: 'Kakao',
    disabled: true,
  },
];

export type StudentFormType = z.infer<typeof StudentFormSchema>;

export type StudentFormProps = {
  defaultValues: StudentFormType;
  onSubmit: SubmitHandler<StudentFormType>;
};

function StudentForm({ defaultValues, onSubmit }: StudentFormProps) {
  const form = useForm<StudentFormType>({
    resolver: zodResolver(StudentFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const onError: SubmitErrorHandler<StudentFormType> = (error) => {
    console.error(error);
  };

  const isSubmittable = form.formState.isDirty && form.formState.isValid;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className='space-y-4'
      >
        <FormField
          name='name'
          control={form.control}
          render={({ field }) => (
            <NormalInputFormItem {...field} type='text' aria-label='이름' />
          )}
        />

        <FormField
          name='email'
          control={form.control}
          render={({ field }) => (
            <NormalInputFormItem
              {...field}
              type='email'
              aria-label='학생 이메일'
              aria-description='연락받을 이메일을 입력하세요.'
            />
          )}
        />

        <FormField
          name='phoneNumber'
          control={form.control}
          render={({ field }) => (
            <NormalInputFormItem {...field} type='text' aria-label='전화번호' />
          )}
        />

        <FormField
          name='notificationType'
          control={form.control}
          render={({ field }) => (
            <RadioFormItem
              {...field}
              options={NOTIFICATION_OPTIONS}
              onValueChange={field.onChange}
              aria-label='알림수신 방법'
            />
          )}
        />

        <FormField
          name='birthday'
          control={form.control}
          render={({ field }) => (
            <NormalInputFormItem
              {...field}
              type='date'
              aria-label='생년월일'
              value={
                field.value instanceof Date
                  ? field.value.toISOString().substring(0, 10)
                  : ''
              }
              onChange={(e) => field.onChange(new Date(e.target.value))}
            />
          )}
        />

        <FormField
          name='school'
          control={form.control}
          render={({ field }) => (
            <NormalInputFormItem {...field} type='text' aria-label='학교' />
          )}
        />

        <FormField
          name='note1'
          control={form.control}
          render={({ field }) => (
            <TextAreaFormItem {...field} aria-label='메모1' />
          )}
        />

        <FormField
          name='note2'
          control={form.control}
          render={({ field }) => (
            <TextAreaFormItem {...field} aria-label='메모2' />
          )}
        />

        <Button type='submit' disabled={!isSubmittable}>
          제출
        </Button>
      </form>
    </FormProvider>
  );
}

export default StudentForm;
