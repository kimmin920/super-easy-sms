import { Button } from '@/components/ui/button';
import { Form, Outlet } from '@remix-run/react';

function Class() {
  return (
    <div>
      class detail!
      <Form action='edit'>
        <Button type='submit'>Go Edit</Button>
      </Form>
      <Outlet />
    </div>
  );
}

export default Class;
