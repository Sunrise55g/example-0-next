import { Metadata } from 'next';

import '@/components/global.css';
import { inter } from '@/components/fonts';
import Providers from '@/providers/Providers';
import { authConfig } from '@/auth.config';
import { auth } from '@/auth';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';



export const metadata: Metadata = {
  title: {
    template: '%s | Example-0 Dashboard',
    default: 'Example-0 Dashboard',
  },
  description: 'Dashboard for Example-0 project.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};


export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {

  const session: any = await auth();
  // console.log('Session in RootLayout:', session);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Providers session={session}>
          <body className={`${inter.className} antialiased`}>{children}</body>
        </Providers>
      </NextIntlClientProvider>
    </html>
  );
}
