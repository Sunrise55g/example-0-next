import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import Form from '@/components/invoices/edit-form';
import Breadcrumbs from '@/components/invoices/breadcrumbs';

import { fetchUsers } from '@/services/users';
import { fetchInvoiceById } from '@/services/revenue';



export const metadata: Metadata = {
    title: 'Edit Invoice',
};



export default async function Page(props: { params: Promise<{ id: string }> }) {

    const params = await props.params;
    const id = params.id;
    const [invoice, users] = await Promise.all([
        fetchInvoiceById(id),
        fetchUsers(),
    ]);


    if (!invoice) {
        notFound();
    }


    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Invoices', href: '/dashboard/invoices' },
                    {
                        label: 'Edit Invoice',
                        href: `/dashboard/invoices/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form invoice={invoice} users={users} />
        </main>
    );
}