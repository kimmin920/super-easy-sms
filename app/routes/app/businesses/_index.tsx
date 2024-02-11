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
  const { businesses, user, error } = useLoaderData<typeof loader>();

  const params = useParams();

  if (
    !params.businessId ||
    !businesses.some((each) => each.id.toString() === params.businessId)
  ) {
    return (
      <div>
        please choose business
        <div className='md:p-8 lg:p-8'>
          <div className='rounded-xl border bg-card text-card-foreground shadow'>
            <div className='flex flex-col p-6 space-y-1'>
              <Form method='post' action={`/action/create-business`}>
                <CreateBusinessForm />
                <Button type='submit'>Create Business</Button>
              </Form>
            </div>
          </div>

          {businesses.map((business) => (
            <div key={business.id}>
              <NavLink to={business.id.toString()}>{business.name}</NavLink>
            </div>
          ))}
        </div>
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
