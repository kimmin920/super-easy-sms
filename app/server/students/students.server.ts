import { createClient } from '@supabase/supabase-js';
import { BusinessIdType, StudentWithCourse } from '~/types/collection';
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
