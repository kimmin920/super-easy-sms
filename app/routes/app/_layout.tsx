import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Outlet, useOutletContext } from '@remix-run/react';
import { createServerClient } from '@supabase/auth-helpers-remix';

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();

  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const { data, error } = await supabaseClient.auth.getUser();

  if (error) {
    return redirect('/auth');
  }

  if (!data.user) {
    return redirect('/auth');
  }

  return null;
}

function AppLayout() {
  const context = useOutletContext();

  return (
    <div className='app-layout h-screen flex flex-col'>
      <Outlet context={context} />
    </div>
  );
}

export default AppLayout;
