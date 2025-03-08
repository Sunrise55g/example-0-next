import { Metadata } from 'next';

import Form from '@/app/dashboard/tickets/invoices/create/create-form';
import Breadcrumbs from '@/components/invoices/breadcrumbs';

import { profilesUsersServiceCore } from '@/services/profile.users.service';
 


export const metadata: Metadata = {
  title: 'Create Invoice',
};



export default async function Page() {
  const users = await profilesUsersServiceCore.profileUsersGetMany();
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form users={users.data} />
    </main>
  );
}