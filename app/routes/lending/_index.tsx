import { Spotlight } from '@/components/animation/Spotlight';
import AiAssistantSection from './components/AiAssistantSection';

import { JoinWaitlistSection } from './components/Test';
import { SpotlightTitle } from './components/SpotlightTitle';

function RendingPage() {
  return (
    <div>
      {/* <TitleSection /> */}
      <SpotlightTitle />
      <AiAssistantSection />

      <JoinWaitlistSection />
    </div>
  );
}

export default RendingPage;
