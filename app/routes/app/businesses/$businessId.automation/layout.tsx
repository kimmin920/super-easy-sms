import { cn } from '@/lib/utils';
import { NavLink, Outlet, useMatch } from '@remix-run/react';

function Automation() {
  const match = useMatch('/app/businesses/personal/automation/');

  return (
    <div>
      {/* NOTE: is this best way? */}
      {match && <Link href='super-easy-sms' name='super-easy-sms' />}

      <Outlet />
    </div>
  );
}

function Link({
  name,
  href,
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
    </NavLink>
  );
}

export default Automation;
