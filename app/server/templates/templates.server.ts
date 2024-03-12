import { createClient } from '@supabase/supabase-js';
import { BusinessIdType } from '~/types/collection';
import { Database } from '~/types/supabase';

export async function getAllTemplates({
  businessId,
}: {
  businessId: BusinessIdType;
}) {
  const supabase = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('sms_templates')
    .select('*')
    .eq('business_id', businessId);

  return { templates: data, error };
}
