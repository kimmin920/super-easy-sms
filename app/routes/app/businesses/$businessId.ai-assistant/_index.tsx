import React from 'react';
import ChatComponent from './components/ChatComponent';

import { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/react';
import { openAI } from '~/services/chatGPTService';

// export const loader: LoaderFunction = async () => {
//   const completion = await openAI.chat.completions.create({
//     messages: [
//       { role: 'system', content: 'You are a helpful assistant.' },
//       { role: 'user', content: 'what can you do?' },
//     ],
//     model: 'gpt-3.5-turbo',
//   });

//   return json({ completion, openAIKey: process.env.OPENAI_API_KEY });
// };

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);

  const completion = await openAI.chat.completions.create({
    messages: [{ role: 'user', content: body.message }],
    model: 'gpt-3.5-turbo',
  });

  return json({ completion });
};

const Home: React.FC = () => {
  return (
    <div>
      <ChatComponent />
    </div>
  );
};

export default Home;
