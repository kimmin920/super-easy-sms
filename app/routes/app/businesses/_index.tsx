import {
  NavLink,
  Outlet,
  useActionData,
  useOutletContext,
  useParams,
} from '@remix-run/react';

import BusinessSwitcher from './_components/BusinessSwitcher';
import { businessesData } from './data';
import { MainNav } from '~/routes/app/businesses/_components/MainNav';
import { UserNav } from './_components/UserNav';
import { Search } from './_components/Search';

import { createServerClient } from '@supabase/auth-helpers-remix';
import { ActionFunctionArgs, json } from '@remix-run/node';

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

function BuisinessRoute() {
  const data = useActionData();
  console.log(data);

  const params = useParams();
  const context = useOutletContext();
  console.log(context);

  if (
    !params.businessId ||
    !businessesData.some((each) => each.value === params.businessId)
  ) {
    return (
      <div>
        please choose business
        <div>
          {businessesData.map((business) => (
            <div key={business.value}>
              <NavLink to={business.value}>{business.label}</NavLink>
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
          <BusinessSwitcher selectedBusinessId={params.businessId} />
          <MainNav className='mx-6' />
          <div className='ml-auto flex items-center space-x-4'>
            <Search />
            <UserNav />
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
