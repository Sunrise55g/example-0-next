import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import NextAuth from 'next-auth';
import createMiddleware from 'next-intl/middleware';

import { authConfig } from './auth.config';
import { handlers, auth } from '@/auth';
import {routing} from './i18n/routing';



// export default NextAuth(authConfig).auth;

const intlMiddleware = createMiddleware(routing);

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};


const PUBLIC_ROUTERS = ['/', '/_next', '/auth/login', '/auth/registration']


export default async function middleware(req: NextRequest) {

  const session = await auth();
  // console.log('middleware: session:', { session })

  const isAuthorized = await authConfig.callbacks.authorized({
    auth: session,
    request: req,
  });
  console.log('middleware: isAuthorized:', { isAuthorized })

  if (isAuthorized === false && 
    ['/auth/login', '/auth/registration'].includes( req.nextUrl.pathname)
  ) {
    console.log('intlMiddleware(req).url',  intlMiddleware(req).url)
    return NextResponse.redirect(new URL('/auth/login', intlMiddleware(req).url));
  }

  if (session && ['/auth/login', '/auth/registration'].includes( req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/dashboard', intlMiddleware(req).url));
  }


  return NextResponse.next();
}