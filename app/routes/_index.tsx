import type { MetaFunction } from '@remix-run/node';
import { NavLink, useOutletContext } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Index() {
  const context = useOutletContext();

  return (
    <div style={{ border: '1px solid red' }}>
      <div>this is _index.tsx in routes.</div>
      <NavLink to={'/app/businesses/personal'}>NAV TO APP</NavLink>
    </div>
  );
}
