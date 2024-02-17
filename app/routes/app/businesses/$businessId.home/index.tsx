import { Card } from '@/components/ui/card';
import MailDisplay from '~/components/MailDisplay';

function index() {
  return (
    <Card className='w-full md:w-[500px] overflow-hidden mx-auto my-auto'>
      <MailDisplay
        mail={{
          id: '6c84fb90-12c4-11e1-840d-7b25c5ee775a',
          name: 'Minwoo Kim',
          email: 'kimmin1253@gmail.com',
          subject: 'Meeting Tomorrow',
          text: " 안녕하세요! 이 프로그램을 개발한 개발자입니다. 이용해 주셔서 진심으로 감사드립니다. 먼저 'Class' 섹션으로 이동하여 수업을 생성하고 학생들을 추가하는 것이 좋습니다. 이렇게 하면 프로그램을 더 효과적으로 활용하실 수 있습니다. 향후 더 많은 기능이 추가될 예정이니, 많은 기대 부탁드립니다! \n\n P.S, 참고로 이 메일의 기능은 실제로 작동하지 않습니다. 재미로 봐주시기 바랍니다! \n\n 💜 🧡 💛 💚 💙 ❤️ 💖",
          date: '2023-10-22T09:00:00',
          read: true,
          labels: ['meeting', 'work', 'important'],
        }}
      />
    </Card>
  );
}

export default index;
