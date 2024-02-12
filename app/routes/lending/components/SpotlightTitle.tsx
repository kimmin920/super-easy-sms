import { Spotlight } from '@/components/animation/Spotlight';

export function SpotlightTitle() {
  return (
    <div className='h-screen w-full flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden'>
      <Spotlight
        className='-top-40 left-0 md:left-60 md:-top-20'
        fill='white'
      />
      <div className='p-4 max-w-7xl  mx-auto relative z-10 w-full pt-20'>
        <h1 className='text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50'>
          The Humpback <br /> is the new trend.
        </h1>
        <p className='mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto'>
          The Humpback is a great way to manage school or institute. Here, we
          are drawing the attention towards the text section of the page. I
          don&apos;t know why but I&apos;m running out of copy.
        </p>
      </div>
    </div>
  );
}
