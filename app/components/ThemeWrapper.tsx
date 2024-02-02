'use client';

import { cn } from '@/lib/utils';
import { useConfig } from '@/hooks/useConfig';

interface ThemeWrapperProps extends React.ComponentProps<'div'> {
  defaultTheme?: string;
}

export function ThemeWrapper({
  defaultTheme,
  children,
  className,
}: ThemeWrapperProps) {
  const [config] = useConfig();

  return (
    <body
      className={cn(
        `theme-${defaultTheme || config.theme}`,
        'w-full',
        className
      )}
      style={
        {
          '--radius': `${defaultTheme ? 0.5 : config.radius}rem`,
        } as React.CSSProperties
      }
    >
      {children}
    </body>
  );
}
