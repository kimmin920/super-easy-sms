import { DateRange } from 'react-day-picker';
import { CourseType, StudentWithCourse } from '~/types/collection';
import { getDatesBetween } from '../utils';
import { DayInString } from '~/types/day';
import { parseCourseSchedule } from '~/services/utils/courseUtils';

export type PaymentsOptionProps = {
  dateRange: DateRange;
  holidays: Date[];
};

export type StudentSettlementInfoType = {
  coursesPaymentInfo: {
    course: CourseType;
    schedulesToPay: {
      day: DayInString | null;
      startTime: string;
      endTime: string;
    }[];
    pricePerCourse: number;
    price: number;
  }[];
  totalPriceForMonthlyPay: number;
  totalPriceForPerCoursePay: number;
};

export function getStudentsPayments(
  students: StudentWithCourse[],
  { dateRange, holidays }: PaymentsOptionProps
) {
  const StudentsSettlements: Record<number, StudentSettlementInfoType> = {};

  const workingDates = getDatesBetween(dateRange, holidays);
  const workingDays = workingDates.map(
    (date) =>
      date
        .toLocaleDateString('en-US', {
          weekday: 'long',
        })
        .toUpperCase() as DayInString
  );

  students.forEach((student) => {
    const coursesPaymentInfo = student.courses.map((course) => {
      const schedules = course.scheduledDays.map((schedule) =>
        parseCourseSchedule(schedule)
      );

      const schedulesToPay = schedules.filter(
        ({ day }) => day && workingDays.includes(day)
      );

      const pricePerCourse =
        course.price / (course.scheduledDays.length || Infinity);

      return {
        course: course,
        schedulesToPay,
        pricePerCourse,
        price: course.price,
      };
    });

    const totalPriceForMonthlyPay = coursesPaymentInfo.reduce((acc, cur) => {
      if (!cur) {
        return acc;
      }

      return acc + cur.price;
    }, 0);

    const totalPriceForPerCoursePay = coursesPaymentInfo.reduce((acc, cur) => {
      if (!cur) {
        return acc;
      }

      return acc + cur.pricePerCourse;
    }, 0);

    const studentPayment = {
      [student.id]: {
        coursesPaymentInfo,
        totalPriceForMonthlyPay,
        totalPriceForPerCoursePay,
      },
    };

    Object.assign(StudentsSettlements, studentPayment);
  });

  return StudentsSettlements;
}
