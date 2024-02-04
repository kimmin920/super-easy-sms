import { Button } from '@/components/ui/button';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { EditClassSheet } from '../_components/EditClassSheet';
import { LoaderFunctionArgs } from '@remix-run/node';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { Database } from '~/types/supabase';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const courseId = params.classId;

  const response = new Response();

  const supabaseClient = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const { data, error } = await supabaseClient
    .from('classes')
    .select()
    .eq('id', courseId)
    .limit(1)
    .single();

  return { course: data };
};

function EditClass() {
  const { course } = useLoaderData<typeof loader>();

  return <EditClassSheet course={course} />;
}

export default EditClass;
