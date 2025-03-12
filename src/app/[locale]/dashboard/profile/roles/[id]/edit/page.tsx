import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';

import EditForm from './edit.form';
import Breadcrumbs from '@/components/breadcrumbs';
import { profileRolesService } from '@/services/profile.roles.service';



export const metadata: Metadata = {
	title: 'Edit Role',
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
  const t = await getTranslations({ locale, namespace: 'ProfileRoles' });

	
	const role: any = await profileRolesService.findOne(+id, token)
	// console.log('Page: role:', {role})

	if (role.statusCode) {
		notFound();
	}



	return (
		<main>
			<Breadcrumbs
				breadcrumbs={[
					{ label: t('title'), href: '/dashboard/profile/roles' },
					{
						label: t('actions.updateTitle'),
						href: `/dashboard/profile/roles/${id}/edit`,
						active: true,
					},
				]}
			/>
			<EditForm role={role} />
		</main>
	);
}