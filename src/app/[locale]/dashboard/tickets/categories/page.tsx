import { Suspense } from 'react';
import { Metadata } from 'next';
import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';

import { lusitana } from '@/components/fonts';
import Pagination from '@/components/pagination';
import { CreateButton } from '@/components/buttons';
import Search from '@/components/search';
import Table from './table';
import { RolesTableSkeleton } from './skeletons';

import { ticketsCategoriesService } from '@/services/tickets.categories.service';




export const metadata: Metadata = {
  title: 'Categories',
};


export default async function Page(
  props: {
    params: Promise<{ locale: string }>;
    searchParams?: Promise<{
      query?: string;
      page?: string;
    }>;
  }
) {

  //
  const session: any = await auth();
  const token = session?.user?.jwt

  //
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'TicketsCategories' });

  //
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  // console.log('Page: searchParams:', searchParams);


  //
  const categoriesObj: any = await ticketsCategoriesService.findMany(searchParams, token);
  const totalPages = categoriesObj.pageCount
  const currentPage = categoriesObj.page



  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>{t('title')}</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder={t('search')} />
        <CreateButton href="/dashboard/tickets/categories/create" />
      </div>
      <Suspense key={query + currentPage} fallback={<RolesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}