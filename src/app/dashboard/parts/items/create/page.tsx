import { Metadata } from 'next';

import Form from '@/app/dashboard/users/create/create-form';
import Breadcrumbs from '@/components/breadcrumbs';

// import { fetchUsers } from '@/services/users';



export const metadata: Metadata = {
  title: 'Create User',
};



export default async function Page() {

  // const users = await fetchUsers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Users', href: '/dashboard/users' },
          {
            label: 'Create User',
            href: '/dashboard/users/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}