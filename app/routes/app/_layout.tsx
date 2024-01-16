import { Outlet } from '@remix-run/react';

function AppLayout() {
  return (
    <div className='app-layout'>
      <Outlet />
    </div>
  );
}

export default AppLayout;
