import { Metadata } from 'next';

import Form from '@/components/invoices/create-form';
import Breadcrumbs from '@/components/invoices/breadcrumbs';

import { fetchUsers } from '@/services/users';
 


export const metadata: Metadata = {
  title: 'Create Invoice',
};



export default async function Page() {
  const users = await fetchUsers();
 
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
      <Form users={users} />
    </main>
  );
}