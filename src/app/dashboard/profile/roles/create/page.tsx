import { Metadata } from 'next';

import Form from './create.form';
import Breadcrumbs from '@/components/breadcrumbs';

import { profileRolesService } from '@/services/profile.roles.service';
import { auth } from '@/auth';



export const metadata: Metadata = {
  title: 'Create Role',
};



export default async function Page() {

  const session:any = await auth();
  const token = session?.user?.jwt

  const rolesObj:any = await profileRolesService.findMany(token)
  console.log('rolesObj:', {rolesObj})
  const roles = rolesObj.data

  
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Roles', href: '/dashboard/profile/roles' },
          {
            label: 'Create Role',
            href: '/dashboard/profile/roles/create',
            active: true,
          },
        ]}
      />
      <Form roles={roles} />
    </main>
  );
}