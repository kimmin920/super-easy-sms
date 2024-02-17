import { useNavigation } from '@remix-run/react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useNavigate, useParams } from '@remix-run/react';
import { CourseType } from '~/types/collection';
import AddClassForm, { ClassFormValues } from './AddClassForm';
import { ScrollArea } from '@/components/ui/scroll-area';

type EditStudentSheetProps = {
  course: CourseType;
};

export function EditClassSheet({ course }: EditStudentSheetProps) {
  const navigate = useNavigate();
  const param = useParams();
  const businessId = param.businessId;

  function onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setTimeout(() => {
        navigate(`/app/businesses/${businessId}/classes`, { replace: true });
      }, 50);
    }
  }

  return (
    <Sheet defaultOpen onOpenChange={onOpenChange}>
      <SheetContent
        onInteractOutside={(e) => e.preventDefault()}
        className='overflow-scroll'
      >
        <SheetHeader>
          <SheetTitle>Edit Student</SheetTitle>
          <SheetDescription>
            Make changes to student profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>

        <AddClassForm
          defaultValues={{
            ...course,
            time: parseCourseSchedule(course.scheduledDays),
          }}
          courseId={course.id}
          actionType='update'
        />
      </SheetContent>
    </Sheet>
  );
}

function parseCourseSchedule(schedules: string[]) {
  const result: ClassFormValues['time'] = schedules.map((string, idx) => {
    const dayMatch = string.match(/#day:([A-Z]+)@/);
    const startMatch = string.match(/@start:(\d{2}:\d{2})@/);
    const endMatch = string.match(/@end:(\d{2}:\d{2})/);

    return {
      id: idx,
      day: dayMatch ? dayMatch[1] : '',
      startTime: startMatch ? startMatch[1] : '',
      endTime: endMatch ? endMatch[1] : '',
    } as unknown as ClassFormValues['time'];
  });

  return result;
}
