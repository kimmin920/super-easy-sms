import { Outlet } from '@remix-run/react';

function ClassesLayout() {
  return (
    <div>
      Classes Layout
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default ClassesLayout;
