'use client'; // Указываем, что это Client Component

import { SessionProvider } from 'next-auth/react';


export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any; // Тип сессии можно уточнить
}) {
  return <SessionProvider session={session}>
    {children}
  </SessionProvider>;
}