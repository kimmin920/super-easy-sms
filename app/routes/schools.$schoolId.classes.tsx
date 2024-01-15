import { Outlet } from '@remix-run/react';

function Classes() {
  return (
    <div>
      Classes-main
      <Outlet />
    </div>
  );
}

export default Classes;
