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
    name: 'Settings',
    href: '/settings',
  },
];

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const params = useParams();
  const navigate = useNavigate();

  const businessId = params.businessId;

  function onSelectValueChange(value: string) {
    navigate(`app/businesses/${value}`);
  }

  const defaultPath = `app/businesses/${businessId}`;

  return (
    <>
      <Select onValueChange={onSelectValueChange} value={businessId}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='vienna'>Vienna</SelectItem>
          <SelectItem value='milan'>Milan</SelectItem>
          <SelectItem value='rome'>Rome</SelectItem>
        </SelectContent>
      </Select>

      <nav
        className={cn('flex items-center space-x-4 lg:space-x-6', className)}
        {...props}
      >
        {NAVS.map((nav) => {
          return (
            <Link
              key={nav.href}
              name={nav.name}
              href={defaultPath + nav.href}
            />
          );
        })}
      </nav>
    </>
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
          'text-sm font-medium transition-colors hover:text-primary',
          !isActive && 'text-muted-foreground'
        )
      }
    >
      {name}
      {children && children}
    </NavLink>
  );
}
