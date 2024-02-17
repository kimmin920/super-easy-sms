import type { MetaFunction } from '@remix-run/node';
import { NavLink, redirect } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export const loader = () => {
  return redirect('/app/businesses');
};

export default function Index() {
  return (
    <div style={{ border: '1px solid red' }}>
      <div>this is _index.tsx in routes.</div>
      <NavLink to={'/app/businesses'}>NAV TO APP</NavLink>
    </div>
  );
}
