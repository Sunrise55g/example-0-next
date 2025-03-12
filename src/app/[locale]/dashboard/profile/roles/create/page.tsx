import { Metadata } from 'next';
import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';

import Form from './create.form';
import Breadcrumbs from '@/components/breadcrumbs';



export const metadata: Metadata = {
  title: 'Create Role',
};



export default async function Page(
  props: {
    params: Promise<{ locale: string }>;
  }
) {

  //
  const session: any = await auth();
  const token = session?.user?.jwt

  //
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'ProfileRoles' });


  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: t('title'), href: '/dashboard/profile/roles' },
          {
            label: t('actions.createTitle'),
            href: '/dashboard/profile/roles/create',
            active: true
          }
        ]}
      />
      <Form />
    </main>
  );
}