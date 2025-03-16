import Link from 'next/link';
import { PowerIcon } from '@heroicons/react/24/outline';
import { useLocale, useTranslations } from 'next-intl';
import { routing } from '@/i18n/routing';

import NavLinks from '@/app/[locale]/dashboard/nav-links';
import Logo from '@/components/logo';
import { signOut } from '@/auth';

import LocaleSwitcherSelect from './locale-switcher-select';




export default function SideNav() {

  const locale = useLocale();
  const tSwitcher = useTranslations('Common');
  const t = useTranslations('SideNav');


  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <Logo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <LocaleSwitcherSelect defaultValue={locale} label={tSwitcher('localeSwitcher.label')}>
          {routing.locales.map((cur) => (
            <option key={cur} value={cur}>
              {tSwitcher('localeSwitcher.locale', { locale: cur })}
            </option>
          ))}
        </LocaleSwitcherSelect>
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: `/${locale}` });
          }}>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">{t('actions.logout')}</div>
          </button>
        </form>
      </div>
    </div>
  );
}
