import React, { useEffect, useState } from 'react';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { googleLogIn } from '~/services/auth.server';
import { Form } from '@remix-run/react';
import { createBrowserClient } from '@supabase/auth-helpers-remix';
import { Database } from '~/types/supabase';

type Props = {
  loggedIn: boolean;
  supabase: SupabaseClient<Database, 'public'>;
};

const GoogleLoginButton: React.FC<Props> = ({ loggedIn, supabase }) => {
  const login = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    console.log('login', data, error);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log(error);
      return error;
    }

    return error;
  };

  return (
    <div>
      {loggedIn ? (
        <button onClick={logout}>logout</button>
      ) : (
        <button onClick={login} type='button'>
          Google 로그인
        </button>
      )}
    </div>
  );
};

export default GoogleLoginButton;
