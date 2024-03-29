'use client';

import { buttonVariants } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import {
  NavLink,
  useLocation,
  useMatch,
  useNavigation,
  useParams,
} from '@remix-run/react';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const match = useMatch('/app/businesses/:businessId/settings/:form');

  return (
    <nav
      className={cn(
        'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            match?.params.form === item.href
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
            'justify-start'
          )}
        >
          {item.title}
        </NavLink>
      ))}
    </nav>
  );
}
