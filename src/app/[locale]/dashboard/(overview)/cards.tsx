'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';

import { lusitana } from '@/components/fonts';
import { profileUsersService } from '@/services/profile-users.service';
import { partsItemsService } from '@/services/parts-items.service';
import { ticketsInvoicesService } from '@/services/tickets-invoices.service';
import { auth } from '@/auth';
import { useEffect, useState } from 'react';




const iconMap = {
  collected: BanknotesIcon,
  users: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};



export default function CardWrapper() {

  //
  const { data: session, status }: any = useSession();
  const token = session?.user?.jwt
  const administrator = session?.user?.profileRole?.administrator || false;
  const moderator = session?.user?.profileRole?.moderator || false;

  //
  const locale = useLocale();
  const t = useTranslations('Dashboard');

  //
  const [usersTotalCount, setUsersTotalCount]: any = useState(null)
  const [partsItemsTotalCount, setPartsItemsTotalCount]: any = useState(null)
  const [invoicesTotalCount, setInvoicesTotalCount]: any = useState(null)

  const [isLoading, setLoading] = useState(true)


  //
  useEffect(() => {

    if (administrator || moderator) {
      Promise.all([
        profileUsersService.totalCount()
          .then((res) => {
            setUsersTotalCount(res)
          }),
        partsItemsService.totalCount()
          .then((res) => {
            setPartsItemsTotalCount(res)
          }),
        ticketsInvoicesService.totalCountCore(token)
          .then((res) => {
            setInvoicesTotalCount(res)
          })

      ])
        .then(() => {
          setLoading(false)
        })
    }
    else {
      Promise.all([
        partsItemsService.totalCount()
          .then((res) => {
            setPartsItemsTotalCount(res)
          }),
        ticketsInvoicesService.totalCountCurrent(token)
          .then((res) => {
            setInvoicesTotalCount(res)
          })

      ])
        .then(() => {
          setLoading(false)
        })
    }


  }, [])

  if (isLoading) return <p>{t('loading')}</p>


  return (
    <>
      <Card title={t('texts.totalItems')} value={partsItemsTotalCount} type="collected" />
      <Card title={t('texts.totalInvoices')} value={invoicesTotalCount} type="invoices" />
      {administrator || moderator && (<Card title={t('texts.totalUsers')} value={usersTotalCount} type="users" />)}
    </>
  );
}



export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'users' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
