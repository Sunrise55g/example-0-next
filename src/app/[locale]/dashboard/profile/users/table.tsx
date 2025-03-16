'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { CheckIcon, XMarkIcon, ClockIcon, TrashIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';

import { lusitana } from '@/components/fonts';
import Search from '@/components/search';
import { UpdateButton, DeleteButton, Button } from '@/components/buttons';

import TableEditForm from './table-edit-form';
import TableCreateForm from './table-create-form';

import { profileRolesService } from '@/services/profile-roles.service';
import { profileUsersService } from '@/services/profile-users.service';



export default function Table({
  query,
  sort,
  currentPage,
}: {
  query: string;
  sort: string;
  currentPage: number;
}) {

  //// params
  const { data: session, status }: any = useSession();
  const token = session?.user?.jwt;

  const locale = useLocale();
  const t = useTranslations('ProfileUsers');

  const searchParams = useMemo(
    () => ({
      page: currentPage || 1,
      query: query || undefined,
      sort: sort || undefined,
    }),
    [currentPage, query, sort]
  );
  // console.log('Table: searchParams:', searchParams);


  ////
  const [profileRoles, setProfileRoles]: any = useState(null);
  const [profileUsers, setProfileUsers]: any = useState(null);
  const [isInitialLoading, setInitialLoading] = useState(true);


  const fetchAllData = async () => {
    try {
      const [rolesRes, usersRes] = await Promise.all([
        profileRolesService.findMany(undefined, token),
        profileUsersService.findMany(searchParams, token),
      ]);
      // console.log('fetchAllData: rolesRes:', { rolesRes });
      // console.log('fetchAllData: usersRes:', { usersRes });

      setProfileRoles(rolesRes);
      setProfileUsers(usersRes);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setInitialLoading(false);
    }
  };


  useEffect(() => {
    fetchAllData();
    const intervalId = setInterval(() => {
      fetchAllData();
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);


  useEffect(() => {
    fetchAllData();
  }, [searchParams]);


  ////
  if (isInitialLoading) return <p>{t('messages.loading')}</p>;
  if (!profileUsers) return <p>{t('messages.noData')}</p>;


  return (
    <div className="w-full mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <TableCreateForm
          profileRoles={profileRoles}
          onCreateSuccess={fetchAllData}
        />

        {profileUsers?.data?.map((profileUser: any) => (
          <TableEditForm
            key={profileUser.id}
            profileRoles={profileRoles}
            profileUser={profileUser}
            onUpdateSuccess={fetchAllData}
          />
        ))}
      </div>
    </div>
  );
}