import { createClient } from '@supabase/supabase-js';
import { BusinessIdType } from '~/types/collection';
import { Database } from '~/types/supabase';

export async function getAllCourses({
  businessId,
}: {
  businessId: BusinessIdType;
}) {
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('classes')
    .select()
    .eq('business_id', businessId);

  if (error) {
    throw error;
  }

  return { courses: data };
}
