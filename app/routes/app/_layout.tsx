import { Outlet } from '@remix-run/react';

function AppLayout() {
  return (
    <div style={{ backgroundColor: 'orange' }}>
      this is App
      <Outlet />
    </div>
  );
}

export default AppLayout;
