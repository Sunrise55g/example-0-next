import { Suspense, useContext } from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import CardWrapper from '@/app/[locale]/dashboard/(overview)/cards';
import InvoicesChart from '@/app/[locale]/dashboard/(overview)/invoices-chart';
import LatestInvoices from '@/app/[locale]/dashboard/(overview)/latest-invoices';
import { lusitana } from '@/components/fonts';

import {
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
  CardsSkeleton
} from './skeletons';




export const metadata: Metadata = {
  title: 'Dashboard',
};




export default async function Page(
  props: {
    params: Promise<{ locale: string }>;
  }
) {

  //
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Dashboard' });


  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        {t('title')}
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <InvoicesChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}