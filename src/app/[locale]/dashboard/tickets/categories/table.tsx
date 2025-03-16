'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import TableEditForm from './table-edit-form';
import TableCreateForm from './table-create-form';

import { ticketsCategoriesService } from '@/services/tickets-categories.service';



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
  const { data: session }: any = useSession();
  const token = session?.user?.jwt;

  const t = useTranslations('TicketsCategories');

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
  const [ticketsCategories, setTicketsCategories]: any = useState(null);
  const [isInitialLoading, setInitialLoading] = useState(true);


  const fetchAllData = async () => {
    try {
      const [categoriesRes] = await Promise.all([
        ticketsCategoriesService.findMany(searchParams, token),
      ]);
      // console.log('fetchAllData: categoriesRes:', { categoriesRes });

      setTicketsCategories(categoriesRes);
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
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);


  useEffect(() => {
    fetchAllData();
  }, [searchParams]);


  ////
  if (isInitialLoading) return <p>{t('messages.loading')}</p>;
  if (!ticketsCategories) return <p>{t('messages.noData')}</p>;


  return (
    <div className="w-full mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <TableCreateForm
          ticketsCategories={ticketsCategories}
          onCreateSuccess={fetchAllData}
        />

        {ticketsCategories?.data?.map((ticketsCategory: any) => (
          <TableEditForm
            key={ticketsCategory.id}
            ticketsCategory={ticketsCategory}
            onUpdateSuccess={fetchAllData}
          />
        ))}
      </div>
    </div>
  );
}