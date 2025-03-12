import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { headers } from 'next/headers';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

import { routing } from '@/i18n/routing';



export default async function NotFound() {

  //
  const defaultLocale = routing.defaultLocale;

  //
  const headersList = await headers();
  const pathname = headersList.get('x-original-pathname') || headersList.get('referer') || '';

  //
  const locale = pathname.split('/')[1] || defaultLocale;
  const t = await getTranslations({ locale, namespace: 'ProfileUsers' });


  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">{t('errors.notFound.title')}</h2>
      <p>{t('errors.notFound.description')}</p>
      <Link
        href="/dashboard/profile/users"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        {t('actions.back')}
      </Link>
    </main>
  );
}