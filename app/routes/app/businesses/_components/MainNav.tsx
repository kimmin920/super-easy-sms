import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useParams, useNavigate } from '@remix-run/react';
import { NavLink } from 'react-router-dom';

const NAVS = [
  {
    name: 'Overview',
    href: '/overview',
  },
  {
    name: 'Students',
    href: '/students',
  },
  {
    name: 'Classes',
    href: '/classes',
  },
  {
    name: 'Automation',
    href: '/automation',
  },
  {
    name: 'Settings',
    href: '/settings',
  },
];

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const params = useParams();
  const businessId = params.businessId;

  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {NAVS.map((nav) => {
        return (
          <Link key={nav.href} name={nav.name} href={businessId + nav.href} />
        );
      })}
    </nav>
  );
}

function Link({
  name,
  href,
  children,
}: {
  name: string;
  href: string;
  children?: React.ReactNode;
}) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          'md:text-sm md:font-medium transition-colors hover:text-primary',
          'text-lg font-semibold',
          !isActive && 'text-muted-foreground'
        )
      }
    >
      {name}
      {children && children}
    </NavLink>
  );
}
