'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import {useLocale, useTranslations} from 'next-intl';
import {
  HomeIcon,
  UserGroupIcon,
  UserIcon,
  RectangleGroupIcon,
  ServerIcon,
  DocumentDuplicateIcon,
  TicketIcon
} from '@heroicons/react/24/outline';




export default function NavLinks() {

  //
  const locale = useLocale();
  const t = useTranslations('SideNav');

  //
  const { data: session, status }: any = useSession();
  const administrator = session?.user?.profileRole?.administrator || false;
  const moderator = session?.user?.profileRole?.moderator || false;

  //
  const pathname = usePathname();
  console.log('pathname:', pathname)


  ////
  const links = [
    { name: 'dashboard', 
      href: `/${locale}/dashboard`, 
      icon: HomeIcon 
    },
    {
      name: 'profileRoles',
      href: `/${locale}/dashboard/profile/roles`,
      icon: UserGroupIcon,
      administrator: true,
      moderator: true
    },
  
    {
      name: 'profileUsers',
      href: `/${locale}/dashboard/profile/users`,
      icon: UserIcon,
      administrator: true,
      moderator: true
    },
  
    {
      name: 'partsCategories',
      href: `/${locale}/dashboard/parts/categories`,
      icon: RectangleGroupIcon,
      administrator: true,
      moderator: true
    },
  
    {
      name: 'partsItems',
      href: `/${locale}/dashboard/parts/items`,
      icon: ServerIcon,
      administrator: true,
      moderator: true
    },
  
    {
      name: 'ticketsCategories',
      href: `/${locale}/dashboard/tickets/categories`,
      icon: DocumentDuplicateIcon,
      administrator: true,
      moderator: true
    },
  
    {
      name: 'ticketsInvoices',
      href: `/${locale}/dashboard/tickets/invoices`,
      icon: TicketIcon,
      administrator: true,
      moderator: true
    },
  
  ];


  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === `${link.href}`,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{t(`items.${link.name}`)}</p>
          </Link>
        );
      })}
    </>
  );
}
