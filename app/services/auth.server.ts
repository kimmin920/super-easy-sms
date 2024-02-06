import { LoaderFunctionArgs } from '@remix-run/node';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { createClient } from '@supabase/supabase-js';
import { Database } from '~/types/supabase';

export async function getUser({
  request,
}: {
  request: LoaderFunctionArgs['request'];
}) {
  const response = new Response();

  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const { data } = await supabaseClient.auth.getUser();

  if (data.user) {
    return { user: data.user };
  }

  throw Error;
}

export async function googleLogIn() {
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
}
