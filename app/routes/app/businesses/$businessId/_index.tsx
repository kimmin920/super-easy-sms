import { ActionFunctionArgs } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { Database } from '~/types/supabase';

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();

  const supabaseClient = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const body = await request.formData();
  const values = Object.fromEntries(body);

  const userData = await supabaseClient.auth.getUser();

  if (!userData.data.user) {
    console.error('add business failed');
    return null;
  }

  const { data, error } = await supabaseClient.from('businesses').insert({
    user_id: userData.data.user.id,
    name: values.name as string,
    plan: values.plan as string,
  });

  if (data) {
    console.log(data);
  }

  if (error) {
    console.log(error);
  }

  return null;
}

function Business() {
  return <Outlet />;
}

export default Business;
