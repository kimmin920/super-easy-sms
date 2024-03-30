import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { addOneStudent } from '~/server/students/students.server';

export async function action({ request }: ActionFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get('businessId');

  if (!businessId) {
    throw redirect('/400');
  }

  try {
    await addOneStudent({ request, businessId });
    return redirect(`/app/businesses/${businessId}/students`);
  } catch (error) {
    throw redirect('/500');
  }
}
