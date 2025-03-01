import { Metadata } from 'next';

import Form from '@/app/dashboard/profile/users/create/create-form';
import Breadcrumbs from '@/components/users/breadcrumbs';

import { profilesRolesServiceCore } from '@/services/profiles.roles.services.core';



export const metadata: Metadata = {
  title: 'Create User',
};



export default async function Page() {

  const roles = (await profilesRolesServiceCore.profileRolesGetMany()).data;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Users', href: '/dashboard/profile/users' },
          {
            label: 'Create User',
            href: '/dashboard/profile/users/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}