import { Separator } from '@/components/ui/separator';
import BusinessForm from './BusinessForm';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import {
  deleteBusiness,
  getOneBusinesses,
  updateBusiness,
} from '~/services/businesses.server';
import { getUser } from '~/services/auth.server';
import { Button } from '@/components/ui/button';
import { ResponsiveDrawerDialog } from '~/components/ResponsiveDrawerDialog';
import DeleteBusinessForm from './DeleteBusinessForm';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const businessId = params.businessId;

  if (!businessId) {
    return null;
  }

  const { user } = await getUser({ request });

  const { business } = await getOneBusinesses({
    businessId: Number(businessId),
    userId: user.id,
    request,
  });

  return { business };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { user } = await getUser({ request });

  const formData = await request.formData();
  const body = Object.fromEntries(formData);

  if (body._action === 'delete') {
    const { success } = await deleteBusiness({
      request,
      userId: user.id,
      businessId: body.id,
    });

    if (success) {
      return redirect('/');
    }

    return;
  }

  const { business } = await updateBusiness({
    request,
    userId: user.id,
    body: {
      name: body.name,
      id: body.id,
      plan: body.plan,
    },
  });

  return {
    business,
  };
};

function Business() {
  const { business } = useLoaderData<typeof loader>();

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Business</h3>
        <p className='text-sm text-muted-foreground'>
          Edit your business info.
        </p>
      </div>
      <Separator />

      <BusinessForm business={business} />

      <Separator />

      <p className='text-rose-400 text-sm'>
        이 비즈니스와 관계된 모든 데이터는 사라지며 복구되지 않습니다
      </p>

      <ResponsiveDrawerDialog
        button={
          <Button variant='destructive' type='button'>
            Delete Business
          </Button>
        }
        form={
          <DeleteBusinessForm
            businessId={business.id}
            businessName={business.name}
          />
        }
        title={'Delete Business'}
        description={''}
      />
    </div>
  );
}

export default Business;
