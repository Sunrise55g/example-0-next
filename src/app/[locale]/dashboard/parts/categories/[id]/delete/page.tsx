import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';

import DeleteForm from './delete-form';
import Breadcrumbs from '@/components/breadcrumbs';

import { partsCategoriesService } from '@/services/parts-categories.service';



export const metadata: Metadata = {
	title: 'Delete Category',
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
	const t = await getTranslations({ locale, namespace: 'PartsCategories' });


	const category: any = await partsCategoriesService.findOne(+id, token)
	// console.log('Page: role:', {role})

	if (category.statusCode) {
		notFound();
	}

	

	return (
		<main>
			<Breadcrumbs
				breadcrumbs={[
					{ label: t('title'), href: '/dashboard/parts/categories' },
					{
						label: t('actions.deleteTitle'),
						href: `/dashboard/parts/categories/${id}/delete`,
						active: true,
					},
				]}
			/>
			<DeleteForm category={category} />
		</main>
	);
}