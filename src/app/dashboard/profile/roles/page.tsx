import { Suspense } from 'react';
import { Metadata } from 'next';
import { auth } from '@/auth';

import { lusitana } from '@/components/fonts';
import Pagination from '@/components/pagination';
import { CreateRole } from '@/app/dashboard/profile/roles/buttons';
import Search from '@/components/search';
import Table from '@/app/dashboard/profile/roles/table';
import { RolesTableSkeleton } from './skeletons';

import { profileRolesService } from '@/services/profile.roles.service';




export const metadata: Metadata = {
  title: 'Roles',
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

  const rolesObj:any = await profileRolesService.findMany(searchParams, token);
  console.log('rolesObj:', {rolesObj})

  const totalPages = rolesObj.pageCount
  const currentPage = rolesObj.page



  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Roles</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search roles..." />
        <CreateRole />
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