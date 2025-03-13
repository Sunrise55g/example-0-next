'use client';

import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { ChangeEvent, ReactNode, useTransition } from 'react';
import { Locale } from '@/i18n/routing';
import { usePathname, useRouter } from '@/i18n/navigation';

type Props = {
  children: ReactNode;
  defaultValue: string;
  label: string;
};

export default function LocaleSwitcherSelect({
  children,
  defaultValue,
  label,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as Locale;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale }
      );
    });
  }

  return (
    <div className="relative w-full">
      <label
        className={clsx(
          'text-gray-700',
          isPending && 'opacity-50 transition-opacity duration-200'
        )}
      >
        <span className="sr-only">{label}</span>
        <select
          className={clsx(
            'w-full appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm font-medium text-gray-700 shadow-sm',
            'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none',
            'hover:bg-gray-50 transition-all duration-200 cursor-pointer',
            isPending && 'cursor-not-allowed opacity-50'
          )}
          defaultValue={defaultValue}
          disabled={isPending}
          onChange={onSelectChange}
        >
          {children}
        </select>
      </label>
    </div>
  );
}