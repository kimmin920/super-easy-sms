import { ActionFunctionArgs, redirect } from "@remix-run/node";
import ClassDataSheet from "./components/ClassDataSheet"
import { createServerClient } from "@supabase/auth-helpers-remix";
import { Database } from "~/types/supabase";

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
    .from('classes')
    .insert(studentsData);

  if (error) {
    return redirect('/500');
  }

  return redirect(`/app/businesses/${params.businessId}/classes`);
}

function ExcelImportPage() {
  return (
    <div className="h-screen overflow-scroll">
      <ClassDataSheet  />
    </div>
  )
}

export default ExcelImportPage