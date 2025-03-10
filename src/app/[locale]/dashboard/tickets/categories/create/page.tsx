import { Metadata } from 'next';

import Form from './create.form';
import Breadcrumbs from '@/components/breadcrumbs';

import { ticketsCategoriesService } from '@/services/tickets.categories.service';
import { auth } from '@/auth';



export const metadata: Metadata = {
  title: 'Create Category',
};



export default async function Page() {

  const session:any = await auth();
  const token = session?.user?.jwt

  const categoriesObj:any = await ticketsCategoriesService.findMany(token)
  console.log('categoriesObj:', {categoriesObj})
  const categories = categoriesObj.data

  
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Categories', href: '/dashboard/tickets/categories' },
          {
            label: 'Create Category',
            href: '/dashboard/tickets/categories/create',
            active: true,
          },
        ]}
      />
      <Form categories={categories} />
    </main>
  );
}