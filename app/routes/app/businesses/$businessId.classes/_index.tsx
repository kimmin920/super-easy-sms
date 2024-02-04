import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import AddButton from 'app/components/AddButton';

import { ResponsiveDrawerDialog } from 'app/components/ResponsiveDrawerDialog';
import AddClassForm from './_components/AddClassForm';
import { ClassCard } from './_components/ClassCard';
import { NavLink, Outlet, useLoaderData, useNavigate } from '@remix-run/react';

import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import { createServerClient } from '@supabase/auth-helpers-remix';
import { Database } from '~/types/supabase';
import { createClient } from '@supabase/supabase-js';

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const response = new Response();
  const businessId = params.businessId;

  const supabase = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  const {
    _action,
    id,
    name,
    coverImgSrc,
    description,
    teacher,
    price,
    priceDescription,
    scheduledDays,
    billingFrequency,
    classCount,
  } = values;

  if (_action === 'create') {
    const { data, error } = await supabase.from('classes').insert({
      name,
      coverImgSrc,
      description,
      teacher,
      price,
      priceDescription,
      scheduledDays: scheduledDays,
      billingFrequency,
      classCount,
      business_id: businessId,
    });
    return { data, error };
  } else if (_action === 'update') {
    const { data, error } = await supabase
      .from('classes')
      .update({
        name,
        coverImgSrc,
        description,
        teacher,
        price,
        priceDescription,
        scheduledDays: scheduledDays,
        billingFrequency,
        classCount,
      })
      .eq('id', id)
      .select();

    return { data, error };
  }

  return redirect('/');
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const businessId = params.businessId;
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data: classes, error: classesError } = await supabase
    .from('classes')
    .select('*')
    .eq('business_id', businessId);

  return {
    classes: classes ?? [],
    classesError,
  };
};

function ClassesLayout() {
  const { classes } = useLoaderData<typeof loader>();

  return (
    <>
      <Tabs defaultValue='overview' className='space-y-4'>
        <>
          <div className='flex items-center justify-between'>
            <TabsList>
              <TabsTrigger value='overview'>Active</TabsTrigger>
              <TabsTrigger value='analytics'>Deactive</TabsTrigger>
            </TabsList>
            <div className='ml-auto'>
              <ResponsiveDrawerDialog
                button={<AddButton label='Add class' />}
                form={<AddClassForm actionType='create' />}
                title={'Add class'}
                description={'add class description'}
              />
            </div>
          </div>

          <div className='space-y-1'>
            <h2 className='text-2xl font-semibold tracking-tight'>Class</h2>
            <p className='text-sm text-muted-foreground'>
              Top picks for you. Updated daily.
            </p>
          </div>

          <Separator className='my-4' />

          <ScrollArea>
            <div className='flex space-x-4 pb-4'>
              {classes.map((eachClass) => (
                <NavLink key={eachClass.name} to={`${eachClass.id}/edit`}>
                  <ClassCard
                    course={eachClass}
                    className='w-[250px]'
                    aspectRatio='portrait'
                    width={250}
                    height={330}
                  />
                </NavLink>
              ))}
            </div>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </>
      </Tabs>
      <Outlet />
    </>
  );
}

export default ClassesLayout;
