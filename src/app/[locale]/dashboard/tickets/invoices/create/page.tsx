import { Metadata } from 'next';

import Form from './create.form';
import Breadcrumbs from '@/components/breadcrumbs';
import { auth } from '@/auth';

import { ticketsCategoriesService } from '@/services/tickets.categories.service';
import { profileUsersService } from '@/services/profile.users.service';




export const metadata: Metadata = {
  title: 'Create Tickets Invoice',
};



export default async function Page() {

  const session:any = await auth();
  const token = session?.user?.jwt

  const categoriesObj:any = await ticketsCategoriesService.findMany(undefined, token)
  const categories = categoriesObj.data

  const usersObj:any = await profileUsersService.findMany(undefined, token)
  const users = usersObj.data

  
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Tickets Invoices', href: '/dashboard/tickets/invoices' },
          {
            label: 'Create Tickets Invoice',
            href: '/dashboard/tickets/invoices/create',
            active: true,
          },
        ]}
      />
      <Form categories={categories} users={users} />
    </main>
  );
}