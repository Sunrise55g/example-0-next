import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ru'],
  defaultLocale: 'ru',
  pathnames: {
    '/': '/',
    '/pathnames': {
      en: '/pathnames',
      ru: '/pathnames'
    }
  }
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
