import { NavLink, Outlet, useParams } from '@remix-run/react';

import BusinessSwitcher from './_components/BusinessSwitcher';
import { businessesData } from './data';
import { MainNav } from '~/routes/app/businesses/_components/MainNav';
import { UserNav } from './_components/UserNav';
import { Search } from './_components/Search';

export interface businessOutletContextType {
  selectedBusinessId: string;
}

function BuisinessRoute() {
  const params = useParams();

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
      <div className='border-b'>
        <div className='flex h-16 items-center px-4'>
          <BusinessSwitcher selectedBusinessId={params.businessId} />
          <MainNav className='mx-6' />
          <div className='ml-auto flex items-center space-x-4'>
            <Search />
            <UserNav />
          </div>
        </div>
      </div>

      <Outlet
        context={{
          selectedBusinessId: params.businessId,
        }}
      />
    </>
  );
}

export default BuisinessRoute;
