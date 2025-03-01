import { Suspense, useContext } from 'react';
import { Metadata } from 'next';

import CardWrapper from '@/components/dashboard/cards';
import RevenueChart from '@/components/dashboard/revenue-chart';
import LatestInvoices from '@/components/dashboard/latest-invoices';
import { lusitana } from '@/components/fonts';

import {
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
  CardsSkeleton
} from '@/components/skeletons';

import  getServerSession  from 'next-auth';
import { authConfig } from '@/auth.config';



export const metadata: Metadata = {
  title: 'Dashboard',
};



export default async function Page() {

  // const session = await getServerSession(authConfig);
  // console.log(session);
  

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
          {/* {data} */}
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}