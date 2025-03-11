import { Metadata } from 'next';

import Form from './create.form';
import Breadcrumbs from '@/components/breadcrumbs';

import { profileRolesService } from '@/services/profile.roles.service';
import { auth } from '@/auth';



export const metadata: Metadata = {
  title: 'Create User',
};



export default async function Page() {

  const session:any = await auth();
  const token = session?.user?.jwt

  const rolesObj:any = await profileRolesService.findMany(undefined, token);
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
      <Form roles={roles} />
    </main>
  );
}