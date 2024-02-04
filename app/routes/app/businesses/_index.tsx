import {
  Form,
  NavLink,
  Outlet,
  useActionData,
  useLoaderData,
  useOutletContext,
  useParams,
} from '@remix-run/react';

import BusinessSwitcher from './_components/BusinessSwitcher';

import { MainNav } from '~/routes/app/businesses/_components/MainNav';
import { UserNav } from './_components/UserNav';
import { Search } from './_components/Search';

import { createServerClient } from '@supabase/auth-helpers-remix';
import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import { ThemeToggle } from '~/components/ThemeToggle';
import { Database } from '~/types/supabase';
import CreateBusinessForm from './_components/CreateBusinessInputs';
import { Button } from '@/components/ui/button';
import { SupabaseUserType } from '~/types/collection';

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
  const data = useActionData();
  const { businesses, user, error } = useLoaderData<typeof loader>();
  console.log('businesses', businesses);
  console.log(error);

  const params = useParams();
  const context = useOutletContext();

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
        <div className='flex h-16 items-center px-4'>
          <BusinessSwitcher
            selectedBusinessId={params.businessId}
            businesses={businesses}
          />
          <MainNav className='mx-6' />
          <div className='ml-auto flex items-center space-x-4'>
            <Search />
            <UserNav user={user as SupabaseUserType} />
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className='flex-1 space-y-4 p-8 pt-6'>
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
