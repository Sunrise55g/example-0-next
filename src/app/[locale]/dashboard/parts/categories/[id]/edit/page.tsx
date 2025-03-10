import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { auth } from '@/auth';

import EditForm from './edit.form';
import Breadcrumbs from '@/components/breadcrumbs';

import { partsCategoriesService } from '@/services/parts.categories.service';



export const metadata: Metadata = {
	title: 'Edit Category',
};



export default async function Page(props: { params: Promise<{ id: string }> }) {

	//
	const session: any = await auth();
	const token = session?.user?.jwt
	// console.log('token:', token)


	//
	const params = await props.params;
	const id = params.id;

	const category: any = await partsCategoriesService.findOne(+id, token)
	// console.log('Page: role:', {role})

	if (category.statusCode) {
		notFound();
	}


	return (
		<main>
			<Breadcrumbs
				breadcrumbs={[
					{ label: 'Categories', href: '/dashboard/parts/categories' },
					{
						label: 'Edit Category',
						href: `/dashboard/parts/categories/${id}/edit`,
						active: true,
					},
				]}
			/>
			<EditForm category={category} />
		</main>
	);
}