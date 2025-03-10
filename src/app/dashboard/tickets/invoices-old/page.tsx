import { Suspense } from 'react';
import { Metadata } from 'next';

import Pagination from '@/components/pagination';
import Search from '@/components/search';
import Table from '@/app/dashboard/tickets/invoices-old/table';
import { CreateButton } from '@/components/buttons';
import { lusitana } from '@/components/fonts';
import { InvoicesTableSkeleton } from '@/components/skeletons';

import { fetchInvoicesPages } from '@/services/old/invoices';




export const metadata: Metadata = {
  title: 'Invoices',
};


export default async function Page(
  props: {
    searchParams?: Promise<{
      query?: string;
      page?: string;
    }>;
  }
) {

  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchInvoicesPages(query);


  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateButton href="/dashboard/tickets/invoices-old/create" />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}