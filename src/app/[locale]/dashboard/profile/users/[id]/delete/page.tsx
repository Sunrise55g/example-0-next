import { Metadata } from 'next';
import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import DeleteForm from './delete.form';
import Breadcrumbs from '@/components/breadcrumbs';

import { profileUsersService } from '@/services/profile.users.service';
import { profileRolesService } from '@/services/profile.roles.service';



export const metadata: Metadata = {
	title: 'Delete User',
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
	const t = await getTranslations({ locale, namespace: 'ProfileUsers' });


	const rolesObj: any = await profileRolesService.findMany(undefined, token)
	// console.log('rolesObj:', {rolesObj})
	const roles = rolesObj.data


	const user: any = await profileUsersService.findOne(+id, token)
	// console.log('Page: user:', {user})

	if (user.statusCode) {
		notFound();
	}


	return (
		<main>
			<Breadcrumbs
				breadcrumbs={[
					{ label: t('title'), href: '/dashboard/profile/users' },
					{
						label: t('actions.deleteTitle'),
						href: `/dashboard/profile/users/${id}/delete`,
						active: true,
					},
				]}
			/>
			<DeleteForm roles={roles} user={user} />
		</main>
	);
}