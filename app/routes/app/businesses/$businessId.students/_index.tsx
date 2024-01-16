import { Outlet } from '@remix-run/react';

function StudentsLayout() {
  return (
    <div>
      StudentsLayout
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default StudentsLayout;
