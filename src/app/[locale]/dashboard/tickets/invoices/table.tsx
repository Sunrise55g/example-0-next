'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { CheckIcon, XMarkIcon, ClockIcon, TrashIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';

import { lusitana } from '@/components/fonts';
import Search from '@/components/search';
import { UpdateButton, DeleteButton, Button } from '@/components/buttons';

import TableEditForm from './table-edit-form';
import TableCreateForm from './table-create-form';

import { profileUsersService } from '@/services/profile-users.service';
import { partsItemsService } from '@/services/parts-items.service';
import { ticketsCategoriesService } from '@/services/tickets-categories.service';
import { ticketsInvoicesService } from '@/services/tickets-invoices.service';
import Link from 'next/link';




export default function Table({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {

  // param
  const { data: session, status }: any = useSession();
  const token = session?.user?.jwt;

  const locale = useLocale();
  const t = useTranslations('TicketsInvoices');

  let searchParams = `page=${currentPage}`;
  if (query) {
    searchParams = `page=${currentPage}&s=${query}`;
  }


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
  }, [searchParams, token]);



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

        {ticketsInvoices?.data.map((ticketsInvoice: any) => (
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