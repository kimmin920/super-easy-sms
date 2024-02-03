import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Form as RemixForm, useNavigation } from '@remix-run/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from '@remix-run/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import CoursesCombobox from '~/components/CoursesCombobox';
import { CourseType, StudentWithCourse } from '~/types/collection';

type EditStudentSheetProps = {
  student: StudentWithCourse;
  courses: CourseType[];
};

const FormSchema = z.object({
  email: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  courseIds: z.array(z.number()),
});

export function EditStudentSheet({ student, courses }: EditStudentSheetProps) {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const param = useParams();
  const businessId = param.businessId;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      courseIds: student.courseIds ?? [],
      name: student.name ?? '',
      phoneNumber: student.phoneNumber ?? '',
      email: student.email ?? '',
    },
  });

  function onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setTimeout(() => {
        navigate(`/app/businesses/${businessId}/students`, { replace: true });
      }, 50);
    }
  }

  return (
    <Sheet defaultOpen onOpenChange={onOpenChange}>
      <SheetContent onInteractOutside={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>Edit Student</SheetTitle>
          <SheetDescription>
            Make changes to student profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <RemixForm
            method='post'
            action={`/action/edit-student-with-course?businessId=${businessId}`}
          >
            <input name='id' value={student.id} hidden />
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='name' className='text-right'>
                  Name
                </Label>
                <Input
                  {...form.register('name')}
                  required
                  className='col-span-3'
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='email' className='text-right'>
                  Email
                </Label>
                <Input
                  type='email'
                  {...form.register('email')}
                  className='col-span-3'
                />
              </div>

              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='phoneNumber' className='text-right'>
                  Phone
                </Label>
                <Input
                  {...form.register('phoneNumber')}
                  className='col-span-3'
                />
              </div>

              <FormField
                control={form.control}
                name='courseIds'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-4 items-center gap-4 space-y-0'>
                    <FormLabel className='text-right'>Courses</FormLabel>
                    <input name={field.name} value={field.value} hidden />
                    <CoursesCombobox
                      className='col-span-3'
                      courses={courses}
                      onClickCourse={(id) => {
                        let value = [...field.value];

                        if (value.includes(id)) {
                          value = value.filter((each) => each !== id);
                        } else {
                          value.push(id);
                        }

                        field.onChange(value);
                      }}
                      checkedCourses={field.value}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter>
              <Button
                type='submit'
                disabled={navigation.state === 'submitting'}
              >
                Save changes
              </Button>
            </SheetFooter>
          </RemixForm>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
