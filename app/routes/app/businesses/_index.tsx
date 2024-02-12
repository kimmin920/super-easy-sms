import {
  Form,
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useParams,
} from '@remix-run/react';

import BusinessSwitcher from './_components/BusinessSwitcher';

import { MainNav } from '~/routes/app/businesses/_components/MainNav';
import { UserNav } from './_components/UserNav';

import { createServerClient } from '@supabase/auth-helpers-remix';
import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import { ThemeToggle } from '~/components/ThemeToggle';
import { Database } from '~/types/supabase';
import CreateBusinessForm from './_components/CreateBusinessInputs';
import { Button } from '@/components/ui/button';
import { SupabaseUserType } from '~/types/collection';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { HamburgerMenuIcon, SunIcon } from '@radix-ui/react-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { ResponsiveDrawerDialog } from '~/components/ResponsiveDrawerDialog';

export interface businessOutletContextType {
  selectedBusinessId: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const response = new Response();

  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error(error);
  }

  return json(
    { data },
    {
      headers: response.headers,
    }
  );
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();

  const supabaseClient = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const { data: businesses, error } = await supabaseClient
    .from('businesses')
    .select('*');

  const { data: userData } = await supabaseClient.auth.getUser();

  return { businesses: businesses ?? [], user: userData.user, error };
};

function BuisinessRoute() {
  const { businesses, user } = useLoaderData<typeof loader>();
  const [createBusinessOpen, setCreateBusinessOpen] = useState(false);

  const params = useParams();

  if (
    !params.businessId ||
    !businesses.some((each) => each.id.toString() === params.businessId)
  ) {
    return (
      <div className='w-screen h-screen dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center'>
        {/* <BackgroundBeams /> */}
        <Card className='w-[350px] p-6 z-50'>
          <div className='flex space-y-1.5 items-center'>
            <div className='flex flex-col'>
              <h2 className='font-semibold leading-none tracking-tight text-lg'>
                Your Businesses
              </h2>
              <p className='text-sm text-muted-foreground'>
                학원을 생성하거나 선택해주세요!
              </p>
            </div>

            <ResponsiveDrawerDialog
              title={'학원 생성하기 ✨'}
              description=''
              button={
                <Button
                  size='icon'
                  variant='outline'
                  className='ml-auto rounded-full'
                  onClick={() => setCreateBusinessOpen(true)}
                >
                  <Plus className='h-4 w-4' />
                  <span className='sr-only'>Add new business</span>
                </Button>
              }
              form={
                <Form
                  method='post'
                  action={`/action/create-business`}
                  className='flex flex-col items-start w-full md:w-[350px]'
                >
                  <CreateBusinessForm />
                  <Button className='mt-6 w-full' type='submit'>
                    Create ✈️
                  </Button>
                </Form>
              }
            />
          </div>

          <Separator className='my-4' />

          <div className='grid gap-6'>
            {businesses.length === 0 ? (
              <div className='flex justify-center items-center text-sm text-muted-foreground text-center h-[100px] my-auto'>
                학원이 아직 없습니다!
              </div>
            ) : (
              businesses.map((business) => (
                <div
                  key={business.id}
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center space-x-4'>
                    <Avatar>
                      <AvatarImage src='/avatars/01.png' alt='Image' />
                      <AvatarFallback>{business.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='text-sm font-medium leading-none'>
                        {business.name}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        #{business.id}
                      </p>
                    </div>
                  </div>
                  <NavLink to={business.id.toString()}>
                    <Button variant='outline'>Enter</Button>
                  </NavLink>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className='backdrop-blur sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='h-16 items-center px-4 hidden md:flex max-w-screen-2xl container'>
          <BusinessSwitcher
            selectedBusinessId={params.businessId}
            businesses={businesses}
          />
          <MainNav className='mx-6' />
          <div className='ml-auto flex items-center space-x-4'>
            <UserNav user={user as SupabaseUserType} />
            <ThemeToggle />
          </div>
        </div>

        {/* NOTE mobile view */}
        <Sheet>
          <SheetTrigger asChild>
            <div className='max-w-8xl mx-auto md:hidden'>
              <div className='py-1 mx-3'>
                <div className='relative flex items-center'>
                  <Button
                    variant='ghost'
                    className='rounded-none background-muted'
                    size='icon'
                  >
                    <HamburgerMenuIcon className='h-6 w-6 fill-black' />
                    <span className='sr-only'>Toggle navigation menu</span>
                  </Button>
                </div>
              </div>
            </div>
          </SheetTrigger>
          <SheetContent side='left'>
            <Link className='mr-6 hidden md:flex' to='#'>
              <SunIcon className='h-6 w-6' />
              <span className='sr-only'>Acme Inc</span>
            </Link>
            <div className='py-6'>
              <MainNav className='flex-col items-start space-y-4' />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className='flex-1 space-y-4 pt-6 container px-4 md:px-8'>
        <Outlet
          context={{
            selectedBusinessId: params.businessId,
          }}
        />
      </div>
    </>
  );
}

export default BuisinessRoute;
