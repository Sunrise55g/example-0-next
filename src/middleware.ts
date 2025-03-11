import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

import { handlers, auth } from '@/auth';
import { authConfig } from './auth.config';
import { routing } from './i18n/routing';


// Конфигурация локалей
const locales = ['en', 'de']; // Список поддерживаемых локалей
const defaultLocale = 'en'; // Локаль по умолчанию

const publicRoutes = ['/_next', '/api/auth'];
const noLoginRoutes = ['/', '/auth/login', '/auth/registration'];


// export default NextAuth(authConfig).auth;

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});


export default async function middleware(req: NextRequest) {

  ////
  const session = await auth();
  // console.log('middleware: session:', { session })


  ////
  const { pathname } = req.nextUrl;
  // console.log('middleware: pathname:', pathname)

  //
  const isPublicRoute = publicRoutes.some(route => {
    if (pathname === route) return true;

    return locales.some(locale =>
      pathname === `/${locale}${route}` ||
      pathname.startsWith(`/${locale}${route}/`)
    ) || pathname.startsWith(route + '/');
  });
  // console.log('middleware: isPublicRoute:', isPublicRoute)

  //
  const isNoLoginRoute = noLoginRoutes.some(route => {
    if (pathname === route) return true;

    if (route === '/') {
      return locales.some(locale => pathname === `/${locale}`) || pathname === '/';
    }

    return locales.some(locale =>
      pathname === `/${locale}${route}` ||
      pathname.startsWith(`/${locale}${route}/`)
    ) || pathname.startsWith(route + '/');
  });
  // console.log('middleware: isNoLoginRoute:', isNoLoginRoute)


  ////
  const isStaticFile = pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/api/');

  if (isStaticFile) {
    return NextResponse.next();
  }


  ////
  const intlResponse = intlMiddleware(req);

  if (isPublicRoute) {
    return intlResponse;
  }

  if (!session && !isNoLoginRoute) {
    const loginUrl = new URL(`/${defaultLocale}/auth/login`, req.url);
    loginUrl.searchParams.set('callbackUrl', encodeURIComponent(pathname));
    return NextResponse.redirect(loginUrl);
  }

  if (session && isNoLoginRoute) {
    const dashboardUrl = new URL(`/${defaultLocale}/dashboard`, req.url);
    dashboardUrl.searchParams.set('callbackUrl', encodeURIComponent(pathname));
    return NextResponse.redirect(dashboardUrl);
  }


  return intlResponse;
}



export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};