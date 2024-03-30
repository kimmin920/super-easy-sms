import { Form as RemixForm, useNavigation } from '@remix-run/react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { useNavigate, useParams } from '@remix-run/react';

import { CourseType } from '~/types/collection';
import StudentForm, {
  StudentFormType,
} from '~/components/students/StudentForm';

type EditStudentSheetProps = {
  student: StudentFormType;
  courses: CourseType[];
};

export function EditStudentSheet({ student, courses }: EditStudentSheetProps) {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const param = useParams();
  const businessId = param.businessId;
  const studentId = param.studentId;

  function onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setTimeout(() => {
        navigate(`/app/businesses/${businessId}/students`, { replace: true });
      }, 50);
    }
  }

  return (
    <Sheet defaultOpen onOpenChange={onOpenChange}>
      <SheetContent
        className='overflow-scroll'
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Edit Student</SheetTitle>
          <SheetDescription>
            Make changes to student profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>

        <RemixForm
          method='POST'
          className='space-y-3'
          action={`/action/edit-student-with-course?businessId=${businessId}&studentId=${studentId}`}
        >
          <StudentForm
            defaultValues={student}
            courseOptions={courses.map((course) => ({
              label: course.name!,
              value: course.id.toString()!,
            }))}
          />
          {/* <input name='id' value={student.id} hidden />
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
                <Label htmlFor='phone_number' className='text-right'>
                  Phone
                </Label>
                <Input
                  {...form.register('phone_number')}
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
            </div> */}

          {/* <SheetFooter>
            <Button type='submit' disabled={navigation.state === 'submitting'}>
              Save changes
            </Button>
          </SheetFooter> */}
        </RemixForm>
      </SheetContent>
    </Sheet>
  );
}
