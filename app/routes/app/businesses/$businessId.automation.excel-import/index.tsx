import { ActionFunctionArgs, redirect } from "@remix-run/node";
import StudentDataSheet from "./components/DataGrid"
import { createServerClient } from "@supabase/auth-helpers-remix";
import { Database } from "~/types/supabase";
import { useSubmit } from "@remix-run/react";

export async function action({ request, params }: ActionFunctionArgs) {
  const response = new Response();

  const supabaseClient = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const body = await request.formData();
  const values = Object.fromEntries(body);

  const studentsData = JSON.parse(values.data);

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    return redirect('/500');
  }

  const { data, error } = await supabaseClient
    .from('students')
    .insert(studentsData);

    console.log(data, error)
  if (error) {
    return redirect('/500');
  }

  return redirect(`/app/businesses/${params.businessId}/students`);
}

function ExcelImportPage() {
  return (
    <div className="h-screen overflow-scroll">
      <StudentDataSheet  />
    </div>
  )
}

export default ExcelImportPage