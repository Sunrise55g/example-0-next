import { Metadata } from 'next';
import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import Breadcrumbs from '@/components/breadcrumbs';
import EditForm from './edit-form';

import { ticketsCategoriesService } from '@/services/tickets-categories.service';
import { profileUsersService } from '@/services/profile-users.service';
import { ticketsInvoicesService } from '@/services/tickets-invoices.service';



export const metadata: Metadata = {
	title: 'Edit Tickets Invoice',
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
	const t = await getTranslations({ locale, namespace: 'TicketsInvoices' });


	const categoriesObj: any = await ticketsCategoriesService.findMany(undefined, token)
	const categories = categoriesObj.data


	const usersObj: any = await profileUsersService.findMany(undefined, token)
	const users = usersObj.data


	const invoice: any = await ticketsInvoicesService.findOne(+id, token)
	// console.log('Page: invoice:', {invoice})

	if (invoice.statusCode) {
		notFound();
	}



	return (
		<main>
			<Breadcrumbs
				breadcrumbs={[
					{ label: t('title'), href: '/dashboard/tickets/invoices' },
					{
						label: t('actions.updateTitle'),
						href: `/dashboard/tickets/invoices/${id}/edit`,
						active: true,
					},
				]}
			/>
			<EditForm categories={categories} users={users} invoice={invoice} />
		</main>
	);
}