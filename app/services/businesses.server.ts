import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { createClient } from '@supabase/supabase-js';
import { Database } from '~/types/supabase';

export async function getAllBusinesses({ userId }: { userId: string }) {
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('businesses')
    .select()
    .eq('user_id', userId);

  return { businesses: data };
}

export async function getOneBusinesses({
  userId,
  businessId,
  request,
}: {
  userId: string;
  businessId: number;
  request: LoaderFunctionArgs['request'];
}) {
  const response = new Response();

  const supabase = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const { data, error } = await supabase
    .from('businesses')
    .select()
    .eq('user_id', userId)
    .eq('id', businessId)
    .limit(1)
    .single();

  if (data) {
    return { business: data };
  }

  throw Error;
}

export async function updateBusiness({
  userId,
  request,
  body,
}: {
  userId: string;
  request: ActionFunctionArgs['request'];
  body: {
    name: string;
    plan: string;
    id: string;
  };
}) {
  const response = new Response();

  const supabase = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const { data, error } = await supabase
    .from('businesses')
    .update({ name: body.name, plan: body.plan })
    .eq('user_id', userId)
    .eq('id', body.id)
    .select();

  if (data) {
    return { business: data[0] };
  }

  console.error(error);
  throw Error;
}

export async function deleteBusiness({
  userId,
  request,
  businessId,
}: {
  userId: string;
  businessId: number;
  request: ActionFunctionArgs['request'];
}) {
  const response = new Response();

  const supabase = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const { error } = await supabase
    .from('businesses')
    .delete()
    .eq('user_id', userId)
    .eq('id', businessId);

  if (!error) {
    return { success: true };
  }

  console.error(error);
  throw Error;
}
