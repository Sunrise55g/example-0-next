import { Metadata } from 'next';
import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';

import Form from './create-form';
import Breadcrumbs from '@/components/breadcrumbs';

import { ticketsCategoriesService } from '@/services/tickets-categories.service';
import { profileUsersService } from '@/services/profile-users.service';



export const metadata: Metadata = {
  title: 'Create Tickets Invoice',
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
  const t = await getTranslations({ locale, namespace: 'TicketsInvoices' });


  const categoriesObj: any = await ticketsCategoriesService.findMany(undefined, token)
  const categories = categoriesObj.data


  const usersObj: any = await profileUsersService.findMany(undefined, token)
  const users = usersObj.data



  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: t('title'), href: '/dashboard/tickets/invoices' },
          {
            label: t('actions.createTitle'),
            href: '/dashboard/tickets/invoices/create',
            active: true,
          },
        ]}
      />
      <Form categories={categories} users={users} />
    </main>
  );
}