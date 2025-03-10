import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { auth } from '@/auth';

import DeleteForm from './delete.form';
import Breadcrumbs from '@/components/breadcrumbs';

import { profileUsersService } from '@/services/profile.users.service';
import { profileRolesService } from '@/services/profile.roles.service';



export const metadata: Metadata = {
	title: 'Delete User',
};



export default async function Page(props: { params: Promise<{ id: string }> }) {

	//
	const session: any = await auth();
	const token = session?.user?.jwt
	// console.log('token:', token)


	const rolesObj: any = await profileRolesService.findMany(undefined, token)
	// console.log('rolesObj:', {rolesObj})
	const roles = rolesObj.data


	//
	const params = await props.params;
	const id = params.id;

	const user: any = await profileUsersService.findOne(+id, token)
	// console.log('Page: user:', {user})

	if (user.statusCode) {
		notFound();
	}


	return (
		<main>
			<Breadcrumbs
				breadcrumbs={[
					{ label: 'Users', href: '/dashboard/profile/users' },
					{
						label: 'Delete User',
						href: `/dashboard/profile/users/${id}/delete`,
						active: true,
					},
				]}
			/>
			<DeleteForm roles={roles} user={user} />
		</main>
	);
}