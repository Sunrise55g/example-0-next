import { Suspense } from 'react';
import { Metadata } from 'next';
import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';

import { lusitana } from '@/components/fonts';
import Pagination from '@/components/pagination';
import { CreateButton } from '@/components/buttons';
import Search from '@/components/search';
import Sorting from '@/components/sorting';
import Table from './table';
import { TableSkeleton } from './skeletons';

import { partsItemsService } from '@/services/parts-items.service';



export const metadata: Metadata = {
  title: 'Parts Items',
};



export default async function Page(
  props: {
    params: Promise<{ locale: string }>;
    searchParams?: Promise<{
      query?: string;
      page?: string;
      sort?: string;
    }>;
  }
) {

  //
  const session: any = await auth();
  const token = session?.user?.jwt

  //
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'PartsItems' });

  //
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const sort = searchParams?.sort || 'id,DESC';
  // console.log('Page: searchParams:', searchParams);


  const invoicesObj: any = await partsItemsService.findMany(searchParams, token);
  const totalPages = invoicesObj.pageCount
  const currentPage = invoicesObj.page


  ///
  const sortOptions = [
    { value: 'id,DESC', label: t('sorting.idDesc') },
    { value: 'id,ASC', label: t('sorting.idAsc') },
    { value: 'createdAt,DESC', label: t('sorting.createdAtDesc') },
    { value: 'createdAt,ASC', label: t('sorting.createdAtAsc') },
    { value: 'updatedAt,DESC', label: t('sorting.updatedAtDesc') },
    { value: 'updatedAt,ASC', label: t('sorting.updatedAtAsc') },
    { value: 'active,DESC', label: t('sorting.activeDesc') },
    { value: 'active,ASC', label: t('sorting.activeAsc') }
  ];



  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>{t('titles.main')}</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder={t('placeholders.search')} />
        <Sorting sortOptions={sortOptions} />
      </div>
      <Suspense key={query + currentPage} fallback={<TableSkeleton />}>
        <Table query={query} sort={sort} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}