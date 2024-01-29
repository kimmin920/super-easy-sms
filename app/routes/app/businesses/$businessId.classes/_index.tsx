import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import AddButton from 'app/components/AddButton';

import { ResponsiveDrawerDialog } from 'app/components/ResponsiveDrawerDialog';
import AddClassForm from './_components/AddClassForm';
import { ClassCard } from './_components/ClassCard';
import { NavLink, useLoaderData } from '@remix-run/react';
import { createClient } from '@supabase/supabase-js';

export const action = async ({ request }: { request: Request }) => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  const {
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
  });

  return { data, error };
};

export const loader = async () => {
  const superbase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data: classes, error: classesError } = await superbase
    .from('classes')
    .select('*');

  return {
    classes: classes ?? [],
    classesError,
  };
};

function ClassesLayout() {
  const { classes } = useLoaderData<typeof loader>();

  return (
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
              form={<AddClassForm />}
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
              <NavLink key={eachClass.name} to={eachClass.id}>
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
  );
}

export default ClassesLayout;
