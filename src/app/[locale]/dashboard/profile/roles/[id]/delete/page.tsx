import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { auth } from '@/auth';

import DeleteForm from './delete.form';
import Breadcrumbs from '@/components/breadcrumbs';

import { profileRolesService } from '@/services/profile.roles.service';



export const metadata: Metadata = {
	title: 'Delete Role',
};



export default async function Page(props: { params: Promise<{ id: string }> }) {

	//
	const session: any = await auth();
	const token = session?.user?.jwt
	// console.log('token:', token)

	//
	const params = await props.params;
	const id = params.id;

	const role: any = await profileRolesService.findOne(+id, token)
	// console.log('Page: role:', {role})

	if (role.statusCode) {
		notFound();
	}


	return (
		<main>
			<Breadcrumbs
				breadcrumbs={[
					{ label: 'Roles', href: '/dashboard/profile/roles' },
					{
						label: 'Delete Role',
						href: `/dashboard/profile/roles/${id}/delete`,
						active: true,
					},
				]}
			/>
			<DeleteForm role={role} />
		</main>
	);
}