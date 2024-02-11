import { GeminiEffect } from '@/components/animation/GeminiEffect';
import { useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

function AiAssistantSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  return (
    <>
      <div
        className='h-[400vh] bg-black w-full dark:border dark:border-white/[0.1] relative pt-40 overflow-clip'
        ref={ref}
      >
        <GeminiEffect
          className='h-[690px]'
          title='AI Assistant built with chatGPT'
          description='chatGPT를 내장한 AI Assistant를 활용한 손쉬운 업무처리'
          pathLengths={[
            pathLengthFirst,
            pathLengthSecond,
            pathLengthThird,
            pathLengthFourth,
            pathLengthFifth,
          ]}
        />
      </div>
    </>
  );
}

export default AiAssistantSection;
