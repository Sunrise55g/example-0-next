'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import TableEditForm from './table-edit-form';
import TableCreateForm from './table-create-form';

import { profileUsersService } from '@/services/profile-users.service';
import { partsItemsService } from '@/services/parts-items.service';
import { ticketsCategoriesService } from '@/services/tickets-categories.service';
import { ticketsInvoicesService } from '@/services/tickets-invoices.service';




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

  const t = useTranslations('TicketsInvoices');

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
  const [profileUsers, setProfileUsers]: any = useState(null);
  const [ticketsCategories, setTicketsCategories]: any = useState(null);
  const [partsItems, setPartsItems]: any = useState(null);
  const [ticketsInvoices, setTicketsInvoices]: any = useState(null);
  const [isInitialLoading, setInitialLoading] = useState(true);


  const fetchAllData = async () => {
    try {
      const [usersRes, categoriesRes, itemsRes, invoicesRes] = await Promise.all([
        profileUsersService.findMany(undefined, token),
        ticketsCategoriesService.findMany(undefined, token),
        partsItemsService.findMany(undefined, token),
        ticketsInvoicesService.findMany(searchParams, token),
      ]);
      // console.log('fetchAllData: invoicesRes:', { invoicesRes });

      setProfileUsers(usersRes);
      setTicketsCategories(categoriesRes);
      setPartsItems(itemsRes);
      setTicketsInvoices(invoicesRes);

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
  if (isInitialLoading && !ticketsInvoices) return <p>{t('messages.loading')}</p>;
  if (!ticketsInvoices) return <p>{t('messages.noData')}</p>;


  return (
    <div className="w-full mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <TableCreateForm
          profileUsers={profileUsers}
          ticketsCategories={ticketsCategories}
          onCreateSuccess={fetchAllData}
        />

        {ticketsInvoices?.data?.map((ticketsInvoice: any) => (
          <TableEditForm
            key={ticketsInvoice.id}
            ticketsInvoice={ticketsInvoice}
            profileUsers={profileUsers}
            ticketsCategories={ticketsCategories}
            partsItems={partsItems}
            onUpdateSuccess={fetchAllData}
          />
        ))}
      </div>
    </div>
  );
}