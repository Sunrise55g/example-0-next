import { Suspense } from 'react';
import { Metadata } from 'next';
import { auth } from '@/auth';

import { lusitana } from '@/components/fonts';
import Pagination from '@/components/pagination';
import { CreateButton } from '@/components/buttons';
import Search from '@/components/search';
import Table from './table';
import { UsersTableSkeleton } from '@/components/skeletons';

import { partsItemsService } from '@/services/parts.items.service';




export const metadata: Metadata = {
  title: 'Parts Items',
};


export default async function Page(
  props: {
    searchParams?: Promise<{
      query?: string;
      page?: string;
    }>;
  }
) {

  const session:any = await auth();
  const token = session?.user?.jwt
  // console.log('token:', token)


  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';

  // console.log('Page: searchParams:', searchParams);

  const itemsObj:any = await partsItemsService.findMany(searchParams, token);

  const totalPages = itemsObj.pageCount
  const currentPage = itemsObj.page



  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Items</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search items..." />
        <CreateButton href="/dashboard/parts/items/create" />
      </div>
      <Suspense key={query + currentPage} fallback={<UsersTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}