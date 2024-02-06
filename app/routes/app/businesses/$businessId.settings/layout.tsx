// import { Separator } from '@/registry/new-york/ui/separator';
// import { SidebarNav } from '@/app/examples/forms/components/sidebar-nav';

import { Separator } from '@/components/ui/separator';
import { SidebarNav } from './components/sidebar-nav';
import { Outlet } from '@remix-run/react';

export const metadata: any = {
  title: 'Forms',
  description: 'Advanced form example using react-hook-form and Zod.',
};

const sidebarNavItems = [
  {
    title: 'Business',
    href: 'business',
  },
  {
    title: 'Account',
    href: 'account',
  },
  {
    title: 'Appearance',
    href: 'appearance',
  },
  {
    title: 'Notifications',
    href: 'notifications',
  },
  {
    title: 'Display',
    href: 'display',
  },
];

export default function SettingsLayout() {
  return (
    <>
      <div className='pb-16'>
        <div className='space-y-0.5'>
          <h2 className='text-2xl font-bold tracking-tight'>Settings</h2>
          <p className='text-muted-foreground'>
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className='my-6' />
        <div className='flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <aside className='-mx-4 lg:w-1/5'>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className='flex-1 lg:max-w-2xl'>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
