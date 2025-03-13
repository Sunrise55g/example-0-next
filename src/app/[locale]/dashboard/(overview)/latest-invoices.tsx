'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import clsx from 'clsx';
import Image from 'next/image';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

import { lusitana } from '@/components/fonts';
import { ticketsInvoicesService } from '@/services/tickets-invoices.service';




export default function LatestInvoices() {

  //
  const { data: session, status }: any = useSession();
  const token = session?.user?.jwt

  //
  const locale = useLocale();
  const t = useTranslations('Dashboard');


  //
  const [latestInvoices, setLatestInvoices]: any = useState(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    ticketsInvoicesService.findMany(undefined, token)
      .then((res) => {
        setLatestInvoices(res)
        setLoading(false)
      })
  }, [])
  // console.log('LatestInvoices: latestInvoices:', latestInvoices)

  if (isLoading) return <p>{t('loading')}</p>
  if (!latestInvoices) return <p>{t('noData')}</p>




  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        {t('texts.latestInvoices')}
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {latestInvoices.data.map((invoice: any, i: any) => {
            return (
              <div
                key={invoice.id}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div className="flex items-center">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base gap-3">
                      {invoice?.customerUser?.firstName}
                      {invoice?.customerUser?.lastNameName}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {invoice?.customerUser?.email}
                    </p>
                  </div>
                </div>
                <p
                  className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                >
                  {invoice.name}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">{t('texts.updatedJustNow')}</h3>
        </div>
      </div>
    </div>
  );
}
