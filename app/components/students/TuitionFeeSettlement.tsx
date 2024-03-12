import { Card } from '@/components/ui/card';
import { StudentSettlementInfoType } from '~/routes/app/businesses/$businessId.automation.super-easy-sms/helpers/studentsParser';
import { StudentWithCourse } from '~/types/collection';

type Props = {
  student: StudentWithCourse;
  settlementInfo: StudentSettlementInfoType;
  message: string;
};

function TuitionFeeSettlement({ student, settlementInfo, message }: Props) {
  return (
    <div>
      monthly: {settlementInfo.totalPriceForMonthlyPay} <br />
      perSession: {settlementInfo.totalPriceForMonthlyPay} <br />
      message:
      <Card className='w-full px-4 py-2 mt-2'>{message}</Card>
      detailed receipt:
      {settlementInfo.coursesPaymentInfo.map((courseInfo) => {
        return (
          <Card key={courseInfo.course.id}>
            <div>강의명: {courseInfo.course.name}</div>
            <div>가격: {courseInfo.price}</div>
            {courseInfo.schedulesToPay.map((schedule) => (
              <span key={schedule.day}>{schedule.day}, </span>
            ))}
          </Card>
        );
      })}
    </div>
  );
}

export default TuitionFeeSettlement;
