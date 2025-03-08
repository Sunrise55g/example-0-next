import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { auth } from '@/auth';

import EditForm from './edit.form';
import Breadcrumbs from '@/components/breadcrumbs';

import { partsCategoriesService } from '@/services/parts.categories.service';
import { partsItemsService } from '@/services/parts.items.service';



export const metadata: Metadata = {
	title: 'Edit Item',
};



export default async function Page(props: { params: Promise<{ id: string }> }) {

	//
	const session: any = await auth();
	const token = session?.user?.jwt
	// console.log('token:', token)


	const categoriesObj: any = await partsCategoriesService.findMany(undefined, token)
	// console.log('categoriesObj:', {categoriesObj})
	const categories = categoriesObj.data


	//
	const params = await props.params;
	const id = params.id;

	const item: any = await partsItemsService.findOne(+id, token)
	// console.log('Page: item:', {item})

	if (item.statusCode) {
		notFound();
	}


	return (
		<main>
			<Breadcrumbs
				breadcrumbs={[
					{ label: 'Items', href: '/dashboard/items' },
					{
						label: 'Edit Item',
						href: `/dashboard/items/${id}/edit`,
						active: true,
					},
				]}
			/>
			<EditForm categories={categories} item={item} />
		</main>
	);
}