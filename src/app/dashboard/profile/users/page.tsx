import { Suspense } from 'react';
import { Metadata } from 'next';
import { auth } from '@/auth';

import { lusitana } from '@/components/fonts';
import Pagination from '@/components/pagination';
import { CreateUser } from './buttons';
import Search from '@/components/search';
import Table from './table';
import { UsersTableSkeleton } from '@/components/skeletons';

import { profileUsersService } from '@/services/profile.users.service';




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

  const session:any = await auth();
  const token = session?.user?.jwt
  // console.log('token:', token)


  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';

  console.log('Page: searchParams:', searchParams);

  const usersObj:any = await profileUsersService.findMany(searchParams, token);
  console.log('usersObj:', {usersObj})

  const totalPages = usersObj.pageCount
  const currentPage = usersObj.page



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