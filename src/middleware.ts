import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { handlers, auth } from '@/auth';
import { authConfig } from './auth.config';
import { routing } from './i18n/routing';


//
const publicRoutes = ['/_next', '/api/auth'];
const noLoginRoutes = ['/', '/auth/login', '/auth/registration'];
const protectedRoutes = ['/dashboard/profile/roles', '/dashboard/profile/users', '/dashboard/tickets/invoices'];

//
const locales = routing.locales;
const defaultLocale = routing.defaultLocale;
const intlMiddleware = createMiddleware(routing);



export default async function middleware(req: NextRequest) {

  //// extract session
  const session = await auth();
  // console.log('middleware: session:', { session })

  const moderator = session?.user?.profileRole?.moderator || false;
  const administrator = session?.user?.profileRole?.administrator || false;
  console.log('middleware: moderator:', moderator)
  console.log('middleware: administrator:', administrator)


  //// extract pathname
  const { pathname } = req.nextUrl;
  // console.log('middleware: pathname:', pathname)


  //// extratc current locale from cookie
  const localeFromCookie: any = req.cookies.get('NEXT_LOCALE')?.value;
  const currentLocale = locales.includes(localeFromCookie) ? localeFromCookie : defaultLocale;
  // console.log('middleware: currentLocale:', currentLocale);


  //// routes handle
  if (pathname.endsWith('.js.map')) {
    // console.log('Caught .js.map request:', pathname);
    return new NextResponse(null, { status: 404 });
  }


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

  //
  const isProtectedRoute = protectedRoutes.some(route => {
    if (pathname === route) return true;

    if (route === '/') {
      return locales.some(locale => pathname === `/${locale}`) || pathname === '/';
    }

    return locales.some(locale =>
      pathname === `/${locale}${route}` ||
      pathname.startsWith(`/${locale}${route}/`)
    ) || pathname.startsWith(route + '/');
  });
  console.log('middleware: isProtectedRoute:', isProtectedRoute)


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
    const loginUrl = new URL(`/${currentLocale}/auth/login`, req.url);
    loginUrl.searchParams.set('callbackUrl', encodeURIComponent(pathname));
    return NextResponse.redirect(loginUrl);
  }

  if (session && isNoLoginRoute) {
    const dashboardUrl = new URL(`/${currentLocale}/dashboard`, req.url);
    dashboardUrl.searchParams.set('callbackUrl', encodeURIComponent(pathname));
    return NextResponse.redirect(dashboardUrl);
  }

  if (!moderator && !administrator && isProtectedRoute) {
    const dashboardUrl = new URL(`/${currentLocale}/dashboard`, req.url);
    dashboardUrl.searchParams.set('callbackUrl', encodeURIComponent(pathname));
    return NextResponse.redirect(dashboardUrl);
  }

  return intlResponse;
}



export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};