import { Metadata } from 'next';

import Form from '@/app/dashboard/profile/users/create/form';
import Breadcrumbs from '@/components/breadcrumbs';

import { profilesRolesServiceCore } from '@/services/profiles.roles.services.core';
import { auth } from '@/auth';



export const metadata: Metadata = {
  title: 'Create User',
};



export default async function Page() {

  const session:any = await auth();
  const token = session?.user?.token

  const rolesObj:any = await profilesRolesServiceCore.findMany(token)
  const roles = rolesObj.data

  
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