import { Form as RemixForm, useNavigation } from '@remix-run/react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useParams } from '@remix-run/react';
import { CourseType } from '~/types/collection';
import AddButton from '~/components/AddButton';
import StudentForm from '~/components/students/StudentForm';

type AddStudentSheetProps = {
  courses: CourseType[];
};

export function AddStudentSheet({ courses }: AddStudentSheetProps) {
  const navigation = useNavigation();
  const param = useParams();
  const businessId = param.businessId;

  return (
    <Sheet>
      <SheetTrigger>
        <AddButton label='ADD' />
      </SheetTrigger>
      <SheetContent
        className='overflow-scroll'
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Add Student</SheetTitle>
          <SheetDescription>
            Make new student profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>

        <RemixForm
          method='POST'
          action={`/action/add-student-with-course?businessId=${businessId}`}
          className='space-y-3'
        >
          <StudentForm
            defaultValues={{}}
            courseOptions={courses.map((course) => ({
              label: course.name!,
              value: course.id.toString()!,
            }))}
          />

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
