import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';

import Breadcrumbs from '@/components/breadcrumbs';
import EditForm from './edit-form';

import { ticketsCategoriesService } from '@/services/tickets-categories.service';



export const metadata: Metadata = {
	title: 'Edit Category',
};



export default async function Page(
	props: {
		params: Promise<{ id: string, locale: string }>
	}
) {

	//
	const session: any = await auth();
	const token = session?.user?.jwt

	//
	const { locale, id } = await props.params;
	const t = await getTranslations({ locale, namespace: 'TicketsCategories' });


	const category: any = await ticketsCategoriesService.findOne(+id, token)
	// console.log('Page: role:', {role})

	if (category.statusCode) {
		notFound();
	}



	return (
		<main>
			<Breadcrumbs
				breadcrumbs={[
					{ label: t('title'), href: '/dashboard/tickets/categories' },
					{
						label: t('actions.updateTitle'),
						href: `/dashboard/tickets/categories/${id}/edit`,
						active: true,
					},
				]}
			/>
			<EditForm category={category} />
		</main>
	);
}