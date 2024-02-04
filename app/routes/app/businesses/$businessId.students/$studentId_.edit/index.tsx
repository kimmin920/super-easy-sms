import { Button } from '@/components/ui/button';
import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { useActionData, useLoaderData, useNavigate } from '@remix-run/react';
import { createClient } from '@supabase/supabase-js';
import { StudentWithCourse } from '~/types/collection';
import { ActionFunctionArgs } from '@remix-run/node';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { Database } from '~/types/supabase';
import { EditStudentSheet } from '../_components/EditStudentSheet';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const studentId = params.studentId;
  const businessId = params.businessId;

  if (!studentId || !businessId) {
    // TODO: error handling
    return redirect('/');
  }

  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data: student, error } = await supabase
    .from('students')
    .select(`*, courses: classes(*), courseIds: classes(id)`)
    .eq('id', studentId)
    .eq('business_id', businessId)
    .limit(1)
    .single();

  const { data: courses, error: CoursesError } = await supabase
    .from('classes')
    .select(`*`)
    .eq('business_id', businessId);

  return {
    courses: courses,
    student: student,
    error,
  };
};

// export async function action({ request, params }: ActionFunctionArgs) {
//   const response = new Response();

//   const supabaseClient = createServerClient<Database>(
//     process.env.SUPABASE_URL!,
//     process.env.SUPABASE_ANON_KEY!,
//     { request, response }
//   );

//   const body = await request.formData();
//   const values = Object.fromEntries(body);

//   const {
//     data: { user },
//   } = await supabaseClient.auth.getUser();

//   if (!user) {
//     return redirect('/500');
//   }

//   const { error } = await supabaseClient
//     .from('students')
//     .update({
//       name: values.name,
//       email: values.email,
//       phoneNumber: values.phoneNumber,
//     })
//     .eq('id', values.id);

//   if (error) {
//     return redirect('/500');
//   }

//   const { error: deleteError } = await supabaseClient
//     .from('students_classes_map')
//     .delete()
//     .eq('student_id', values.id);

//   const relationship = values.courseIds.split(',').map((cid) => ({
//     student_id: values.id,
//     class_id: cid,
//   }));

//   await supabaseClient.from('students_classes_map').insert(relationship);

//   return redirect(`/app/businesses/${params.businessId}/students`);
// }

function EditStudent() {
  const { student, courses } = useLoaderData<typeof loader>();
  console.log({ student, courses });
  return (
    <div>
      <EditStudentSheet
        student={{
          ...student,
          courseIds: student?.courseIds.map((each) => each.id),
        }}
        courses={courses}
      />
    </div>
  );
}

export default EditStudent;
