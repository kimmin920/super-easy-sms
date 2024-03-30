import { ActionFunctionArgs } from '@remix-run/node';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { createClient } from '@supabase/supabase-js';

import {
  BusinessIdType,
  StudentType,
  StudentWithCourse,
} from '~/types/collection';
import { Database } from '~/types/supabase';

type StudentsServerArgType = {
  businessId: BusinessIdType;
  range: {
    start: number;
    end: number;
  };
  parmas: {
    name: string;
  };
};

export async function getManyStudents({
  businessId,
  range,
  parmas,
}: StudentsServerArgType) {
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('students')
    .select(`*, courses: classes(*)`)
    .eq('business_id', businessId)
    .ilike('name', `%${parmas.name}%`)
    .order('id', { ascending: false })
    .range(range.start, range.end);

  const students: StudentWithCourse[] = (data ?? []).map((student) => ({
    ...student,
    courseIds: student.courses.map((each) => each.id),
  }));

  return { students, error };
}

export async function deleteOneStudent(id: string) {
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { error, status } = await supabase
    .from('students')
    .delete()
    .eq('id', id);

  return { error, status };
}

export async function getOneStudent({
  businessId,
  studentId,
}: {
  businessId: BusinessIdType;
  studentId: StudentType['id'];
}) {
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

  if (error) {
    throw error;
  }

  return { student };
}

export async function addOneStudent({
  request,
  businessId,
}: {
  request: ActionFunctionArgs['request'];
  businessId: string;
}) {
  const response = new Response();

  const supabaseClient = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const body = await request.formData();
  const values = Object.fromEntries(body);
  const courseIds = body.getAll('courseIds');

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    throw new Error('user not found');
  }

  const { data, error } = await supabaseClient.rpc(
    'create_student_and_courses_int8',
    {
      business_id_param: Number(businessId),
      name_param: values.name,
      email_param: values.email,
      phonenumber_param: values.phone_number,
      school_param: values.school,
      note1_param: values.note1,
      note2_param: values.note2,
      course_ids_param: courseIds as any,
    }
  );

  if (error) {
    throw error;
  }

  return data;
}

export async function editOneStudent({
  request,
  businessId,
  studentId,
}: {
  request: ActionFunctionArgs['request'];
  businessId: string;
  studentId: string;
}) {
  const response = new Response();

  const supabaseClient = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const body = await request.formData();
  const values = Object.fromEntries(body);
  const courseIds = body.getAll('courseIds');

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    throw new Error('user not found');
  }

  const { data, error } = await supabaseClient.rpc(
    'edit_student_and_courses_int8',
    {
      student_id_param: Number(studentId),
      business_id_param: Number(businessId),
      name_param: values.name,
      email_param: values.email,
      phonenumber_param: values.phone_number,
      school_param: values.school,
      note1_param: values.note1,
      note2_param: values.note2,
      new_course_ids_param: courseIds as any,
    }
  );

  return { data, error };
}
