import { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import '@/components/global.css';
import { inter } from '@/components/fonts';
import { auth } from '@/auth';



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
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {

  const session: any = await auth();
  // console.log('Session in RootLayout:', session);

  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionProvider session={session}>
            {children}
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
