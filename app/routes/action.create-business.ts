import { ActionFunctionArgs, redirect } from '@remix-run/node';
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

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    return redirect('/');
  }

  const { data, error } = await supabaseClient
    .from('businesses')
    .insert({
      user_id: user.id,
      name: values.name as string,
      plan: values.plan as string,
    })
    .select();

  if (data) {
    return redirect(`/app/businesses/${data[0].id}/home`);
  }

  // NOTE error handling..
}
