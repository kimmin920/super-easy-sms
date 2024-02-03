import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { Database } from '~/types/supabase';

export async function action({ request, params }: ActionFunctionArgs) {
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
    return redirect('/500');
  }

  const { data: newStudent, error } = await supabaseClient
    .from('students')
    .insert({
      name: values.name,
      email: values.email,
      phoneNumber: values.phoneNumber,
    })
    .select()
    .limit(1)
    .single();

  if (error || !newStudent) {
    return redirect('/500');
  }

  const relationship = values.courseIds.split(',').map((cid) => ({
    student_id: newStudent.id,
    class_id: cid,
  }));

  await supabaseClient.from('students_classes_map').insert(relationship);

  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get('businessId');

  return redirect(`/app/businesses/${businessId}/students`);
}
