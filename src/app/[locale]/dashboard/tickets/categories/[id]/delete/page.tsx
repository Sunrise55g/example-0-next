import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { auth } from '@/auth';

import DeleteForm from './delete.form';
import Breadcrumbs from '@/components/breadcrumbs';

import { ticketsCategoriesService } from '@/services/tickets.categories.service';



export const metadata: Metadata = {
	title: 'Delete Category',
};



export default async function Page(props: { params: Promise<{ id: string }> }) {

	//
	const session: any = await auth();
	const token = session?.user?.jwt
	// console.log('token:', token)

	//
	const params = await props.params;
	const id = params.id;

	const category: any = await ticketsCategoriesService.findOne(+id, token)
	// console.log('Page: role:', {role})

	if (category.statusCode) {
		notFound();
	}


	return (
		<main>
			<Breadcrumbs
				breadcrumbs={[
					{ label: 'Categories', href: '/dashboard/tickets/categories' },
					{
						label: 'Delete Category',
						href: `/dashboard/tickets/categories/${id}/delete`,
						active: true,
					},
				]}
			/>
			<DeleteForm category={category} />
		</main>
	);
}