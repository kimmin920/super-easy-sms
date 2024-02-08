import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Form, useActionData, useLoaderData } from '@remix-run/react';

export default function ChatComponent() {
  // const data = useLoaderData();
  const answerData = useActionData();

  return (
    <div>
      <h1>AI Response</h1>
      {/* <p>AI: {data.completion.choices[0].message.content}</p> */}
      <Separator />
      <div>
        {answerData && answerData.completion.choices[0].message.content}
      </div>
      <Separator />
      <Form method='post'>
        <Input type='text' name='message' />
        <button type='submit'>submit</button>
      </Form>
    </div>
  );
}
