'use client';

import { useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';



export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  //
  const locale = useLocale();
  const t = useTranslations('ProfileRoles');


  useEffect(() => {
    console.error(error);
  }, [error]);


  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">{t('errors.error.title')}</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          () => reset()
        }
      >
        {t('actions.tryAgain')}
      </button>
    </main>
  );
}