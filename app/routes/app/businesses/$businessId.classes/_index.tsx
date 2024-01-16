import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import AddButton from 'app/components/AddButton';

import { ResponsiveDrawerDialog } from 'app/components/ResponsiveDrawerDialog';
import AddClassForm from './_components/AddClassForm';
import { ClassCard } from './_components/ClassCard';
import { allClasses } from './_mockdata';
import { NavLink } from '@remix-run/react';

function ClassesLayout() {
  return (
    <Tabs defaultValue='overview' className='space-y-4'>
      <>
        <div className='flex items-center justify-between'>
          <TabsList>
            <TabsTrigger value='overview'>Active</TabsTrigger>
            <TabsTrigger value='analytics'>Deactive</TabsTrigger>
          </TabsList>
          <div className='ml-auto mr-4'>
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
            {allClasses.map((eachClass) => (
              <NavLink key={eachClass.name} to={eachClass.id}>
                <ClassCard
                  album={eachClass}
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
