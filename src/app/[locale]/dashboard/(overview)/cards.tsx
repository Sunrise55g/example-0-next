import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/components/fonts';


import { profileUsersService } from '@/services/profile.users.service';
import { partsItemsService } from '@/services/parts.items.service';
import { ticketsInvoicesService } from '@/services/tickets.invoices.service';
import { auth } from '@/auth';




const iconMap = {
  collected: BanknotesIcon,
  users: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};



export default async function CardWrapper() {

  const session:any = await auth();
  const token = session?.user?.jwt

  const usersTotalCount = await profileUsersService.totalCount()
  const partsItemsTotalCount = await partsItemsService.totalCount()
  const invoicesTotalCount = await ticketsInvoicesService.totalCountCore(token)


  return (
    <>
      <Card title="Total Items" value={partsItemsTotalCount} type="collected" />
      <Card title="Total Invoices" value={invoicesTotalCount} type="invoices" />
      <Card title="Total Users" value={usersTotalCount} type="users"/>
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
