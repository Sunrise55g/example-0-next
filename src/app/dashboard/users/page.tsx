import { Suspense } from 'react';
import { Metadata } from 'next';

import Pagination from '@/components/users/pagination';
import Search from '@/components/search';
import Table from '@/components/users/table';
import { CreateUser } from '@/components/users/buttons';
import { lusitana } from '@/components/fonts';
import { UsersTableSkeleton } from '@/components/skeletons';

import { fetchUsersPages } from '@/services/users';




export const metadata: Metadata = {
  title: 'Users',
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
  const totalPages = await fetchUsersPages(query);


  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Users</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search users..." />
        <CreateUser />
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