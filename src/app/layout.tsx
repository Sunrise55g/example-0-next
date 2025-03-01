import { Metadata } from 'next';

import '@/components/global.css';
import { inter } from '@/components/fonts';
import Providers from '@/providers/Providers';
import { authConfig } from '@/services/auth.config';
import { auth } from '@/services/auth.service';




export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session: any = await auth();
  // console.log('Session in RootLayout:', session);

  return (
    <Providers session={session}>
      <html lang="en">
        <body className={`${inter.className} antialiased`}>{children}</body>
      </html>
    </Providers>

  );
}
