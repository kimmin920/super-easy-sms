import { Outlet } from '@remix-run/react';

function Business() {
  return (
    <div>
      A Business
      <Outlet />
    </div>
  );
}

export default Business;
