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
import { parseCourseSchedule } from '~/services/utils/courseUtils';

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
            time: parseCourseSchedules(course.scheduledDays),
          }}
          courseId={course.id}
          actionType='update'
        />
      </SheetContent>
    </Sheet>
  );
}


export function parseCourseSchedules(schedules: string[]) {
  const result: ClassFormValues['time'] = schedules.map((string, idx) => {
    const { day, startTime, endTime } = parseCourseSchedule(string);

    return {
      id: idx,
      day: day,
      startTime: startTime,
      endTime: endTime,
    } as unknown as ClassFormValues['time'];
  });

  return result;
}
