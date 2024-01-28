'use client';

import * as React from 'react';

import { Progress } from '@/components/ui/progress';

export function NavigationLoadingBar() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Progress
      value={progress}
      className='fixed w-screen z-[100] rounded-none h-1'
    />
  );
}
