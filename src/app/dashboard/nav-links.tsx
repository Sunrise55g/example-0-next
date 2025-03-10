'use client';

import {
  HomeIcon,
  UserGroupIcon,
  UserIcon,
  RectangleGroupIcon,
  ServerIcon,
  DocumentDuplicateIcon,
  TicketIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';



// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', 
    href: '/dashboard', 
    icon: HomeIcon 
  },
  {
    name: 'Profile Roles',
    href: '/dashboard/profile/roles',
    icon: UserGroupIcon,
    administrator: true,
    moderator: true
  },

  {
    name: 'Profile Users',
    href: '/dashboard/profile/users',
    icon: UserIcon,
    administrator: true,
    moderator: true
  },

  {
    name: 'Parts Categories',
    href: '/dashboard/parts/categories',
    icon: RectangleGroupIcon,
    administrator: true,
    moderator: true
  },

  {
    name: 'Parts Items',
    href: '/dashboard/parts/items',
    icon: ServerIcon,
    administrator: true,
    moderator: true
  },

  {
    name: 'Tickets Categories',
    href: '/dashboard/tickets/categories',
    icon: DocumentDuplicateIcon,
    administrator: true,
    moderator: true
  },

  {
    name: 'Tickets Invoices',
    href: '/dashboard/tickets/invoices',
    icon: TicketIcon,
    administrator: true,
    moderator: true
  },

];



export default function NavLinks() {

  //
  const { data: session, status }: any = useSession();
  
  const administrator = session?.user?.profileRole?.administrator || false;
  const moderator = session?.user?.profileRole?.moderator || false;

  console.log('administrator:', administrator)
  console.log('moderator:', moderator)

  //
  const pathname = usePathname();


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
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
