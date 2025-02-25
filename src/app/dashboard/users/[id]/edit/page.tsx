import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import Form from '@/components/users/edit-form';
import Breadcrumbs from '@/components/users/breadcrumbs';

import { fetchUserById } from '@/services/users';



export const metadata: Metadata = {
    title: 'Edit User',
};



export default async function Page(props: { params: Promise<{ id: string }> }) {

    const params = await props.params;
    const id = params.id;
    const [user] = await Promise.all([
        fetchUserById(id),
    ]);


    if (!user) {
        notFound();
    }


    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Users', href: '/dashboard/users' },
                    {
                        label: 'Edit User',
                        href: `/dashboard/users/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form user={user} />
        </main>
    );
}