import React from 'react';
import ChatComponent from './components/ChatComponent';

import { ActionFunction, LoaderFunction, json } from '@remix-run/node';
import { openAI } from '~/services/chatGPTService';

export const loader: LoaderFunction = async () => {
  return json({
    ENV: process.env.OPENAI_API_KEY,
  });
};

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
  return <>COMMING SOON...</>;
  // return <ChatComponent />;
};

export default Home;
