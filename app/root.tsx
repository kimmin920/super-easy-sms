import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
  useNavigation,
  useRevalidator,
  useRouteError,
} from '@remix-run/react';

import styles from '././globals.css';
import '~/registry/themes.css';

import { cssBundleHref } from '@remix-run/css-bundle';
import { NavigationLoadingBar } from './components/NavigationLoadingBar';

import {
  createBrowserClient,
  createServerClient,
} from '@supabase/auth-helpers-remix';
import { Database } from './types/supabase';
import { useEffect, useState } from 'react';
import { themeSessionResolver } from './sessions.server';
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from 'remix-themes';
import clsx from 'clsx';
import { ThemeWrapper } from './components/ThemeWrapper';

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
  { rel: 'stylesheet', href: styles },
];

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const response = new Response();

    const supabaseClient = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      { request, response }
    );

    const { data, error } = await supabaseClient.auth.getUser();

    if (!data) {
      console.error('get user error', error);
      return;
    }

    const { getTheme } = await themeSessionResolver(request);

    return json({
      user: data.user,
      themeData: getTheme(),
      ENV: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
        GOOGLE_CLIENT_KEY: process.env.GOOGLE_CLIENT_KEY,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export function App() {
  const error = useRouteError();
  console.log(error);

  const { ENV, user, themeData } = useLoaderData<typeof loader>();
  const [theme] = useTheme();

  const navigation = useNavigation();
  const revalidator = useRevalidator();

  const [supabase] = useState(() =>
    createBrowserClient<Database>(ENV.SUPABASE_URL!, ENV.SUPABASE_ANON_KEY!)
  );

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user.id !== user?.id) {
        revalidator.revalidate();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, revalidator, user]);

  useEffect(() => {
    const gscript = document.createElement('script');
    gscript.id = 'google-one-tab-login';
    gscript.src = 'https://accounts.google.com/gsi/client';
    gscript.async = true;
    document.body.appendChild(gscript);

    gscript.onload = () => {
      google.accounts.id.initialize({
        client_id: ENV.GOOGLE_CLIENT_KEY,
        callback: async (response) => {
          if (response.credential) {
            const { error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.credential,
            });

            if (error) {
              console.error(error);
            }
          }
        },
      });

      // google login prompt 뜨게 하기
      google.accounts.id.prompt();
    };

    return () => {
      const gscript = document.getElementById('google-one-tab-login');
      gscript?.remove();
    };
  }, [supabase]);

  return (
    <html lang='en' className={clsx(theme)}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(themeData)} />
        <Links />
      </head>

      <ThemeWrapper>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />

        <ScrollRestoration />
        <Scripts />
        <LiveReload />

        {navigation.state === 'loading' && <NavigationLoadingBar />}

        <Outlet context={{ user, supabase }} />
      </ThemeWrapper>
    </html>
  );
}

export default function AppWithProviders() {
  const { themeData } = useLoaderData<typeof loader>();

  return (
    <ThemeProvider specifiedTheme={themeData} themeAction='/action/set-theme'>
      <App />
    </ThemeProvider>
  );
}
