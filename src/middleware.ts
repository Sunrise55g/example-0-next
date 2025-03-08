import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import NextAuth from 'next-auth';

import { authConfig } from './auth.config';
import { handlers, auth } from '@/auth';




// export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};


export default async function middleware(req: NextRequest) {

  const session = await auth();
  console.log('middleware: session:', { session })

  const isAuthorized = await authConfig.callbacks.authorized({
    auth: session,
    request: req,
  });
  console.log('middleware: isAuthorized:', { isAuthorized })

  if (isAuthorized === false) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  if (session && req.nextUrl.pathname === '/auth/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }


  return NextResponse.next();
}