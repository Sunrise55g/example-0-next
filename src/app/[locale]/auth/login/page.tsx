import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import Logo from '@/components/logo';
import LoginForm from '@/app/[locale]/auth/login/LoginForm';



export const metadata: Metadata = {
  title: 'Login',
};


export default async function LoginPage(
  props: {
    params: Promise<{ locale: string }>;
  }
) {

  //
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'AuthLogin' });


  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5">
        <div className="flex h-20 w-full items-center justify-center rounded-lg bg-blue-500 p-3">
          <Logo />
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}

