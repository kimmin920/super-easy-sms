import { Button } from '@/components/ui/button';
import { Form } from '@remix-run/react';

function Class() {
  return (
    <div>
      Class folder
      <div>
        <Form action='edit'>
          <Button type='submit'>Go Edit</Button>
        </Form>
      </div>
    </div>
  );
}

export default Class;
