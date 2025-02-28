'use server';

import postgres from 'postgres';
import {
	UserField,
	UsersTableType,
	InvoiceForm,
	InvoicesTable,
	LatestInvoiceRaw,
	Revenue,
} from '../../types/old/definitions';
import { formatCurrency } from '../utils';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'prefer' });




export async function fetchLatestInvoices() {
	try {
		const data = await sql<LatestInvoiceRaw[]>`
        SELECT invoices.amount, users.name, users.image_url, users.email, invoices.id
        FROM invoices
        JOIN users ON invoices.user_id = users.id
        ORDER BY invoices.date DESC
        LIMIT 5`;

		const latestInvoices = data.map((invoice) => ({
			...invoice,
			amount: formatCurrency(invoice.amount),
		}));
		return latestInvoices;
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch the latest invoices.');
	}
}

export async function fetchCardData() {
	try {
		// You can probably combine these into a single SQL query
		// However, we are intentionally splitting them to demonstrate
		// how to initialize multiple queries in parallel with JS.
		const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
		const userCountPromise = sql`SELECT COUNT(*) FROM users`;
		const invoiceStatusPromise = sql`SELECT
           SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
           SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
           FROM invoices`;

		const data = await Promise.all([
			invoiceCountPromise,
			userCountPromise,
			invoiceStatusPromise,
		]);

		const numberOfInvoices = Number(data[0][0].count ?? '0');
		const numberOfUsers = Number(data[1][0].count ?? '0');
		const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
		const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

		return {
			numberOfUsers,
			numberOfInvoices,
			totalPaidInvoices,
			totalPendingInvoices,
		};
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch card data.');
	}
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
	query: string,
	currentPage: number,
) {

	const offset = (currentPage - 1) * ITEMS_PER_PAGE;

	try {
		const invoices = await sql<InvoicesTable[]>`
        SELECT
          invoices.id,
          invoices.amount,
          invoices.date,
          invoices.status,
          users.name,
          users.email,
          users.image_url
        FROM invoices
        JOIN users ON invoices.user_id = users.id
        WHERE
          users.name ILIKE ${`%${query}%`} OR
          users.email ILIKE ${`%${query}%`} OR
          invoices.amount::text ILIKE ${`%${query}%`} OR
          invoices.date::text ILIKE ${`%${query}%`} OR
          invoices.status ILIKE ${`%${query}%`}
        ORDER BY invoices.date DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;

		return invoices;
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch invoices.');
	}
}

export async function fetchInvoicesPages(query: string) {
	try {
		const data = await sql`SELECT COUNT(*)
      FROM invoices
      JOIN users ON invoices.user_id = users.id
      WHERE
        users.name ILIKE ${`%${query}%`} OR
        users.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
    `;

		const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
		return totalPages;
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch total number of invoices.');
	}
}

export async function fetchInvoiceById(id: string) {
	try {
		const data = await sql<InvoiceForm[]>`
        SELECT
          invoices.id,
          invoices.user_id,
          invoices.amount,
          invoices.status
        FROM invoices
        WHERE invoices.id = ${id};
      `;

		const invoice = data.map((invoice) => ({
			...invoice,
			// Convert amount from cents to dollars
			amount: invoice.amount / 100,
		}));

		return invoice[0];
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch invoice.');
	}
}


//
const FormSchema = z.object({
	id: z.string(),

	userId: z.string({
		invalid_type_error: 'Please select a user.',
	}),

	amount: z.coerce
		.number()
		.gt(0, { message: 'Please enter an amount greater than $0.' }),

	status: z.enum(['pending', 'paid'], {
		invalid_type_error: 'Please select an invoice status.',
	}),

	date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
	errors?: {
		userId?: string[];
		amount?: string[];
		status?: string[];
	};
	message?: string | null;
};


export async function createInvoice(prevState: State, formData: FormData) {

	// Validate form fields using Zod
	const validatedFields = CreateInvoice.safeParse({
		userId: formData.get('userId'),
		amount: formData.get('amount'),
		status: formData.get('status'),
	});

	// If form validation fails, return errors early. Otherwise, continue.
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Missing Fields. Failed to Create Invoice.',
		};
	}

	// Prepare data for insertion into the database
	const { userId, amount, status } = validatedFields.data;
	const amountInCents = amount * 100;
	const date = new Date().toISOString().split('T')[0];

	try {
		await sql`
        INSERT INTO invoices (user_id, amount, status, date)
        VALUES (${userId}, ${amountInCents}, ${status}, ${date})
    `;
	} catch (error) {
		return {
			message: 'Database Error: Failed to Create Invoice.',
		};
	}

	revalidatePath('/dashboard/invoices');
	redirect('/dashboard/invoices');
}



//
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, prevState: State, formData: FormData) {

	// Validate form fields using Zod
	const validatedFields = UpdateInvoice.safeParse({
		userId: formData.get('userId'),
		amount: formData.get('amount'),
		status: formData.get('status'),
	});

	// If form validation fails, return errors early. Otherwise, continue.
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Missing Fields. Failed to Update Invoice.',
		};
	}

	// Prepare data for insertion into the database
	const { userId, amount, status } = validatedFields.data;
	const amountInCents = amount * 100;

	// Update the invoice
	try {
		await sql`
    UPDATE invoices
    SET user_id = ${userId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
	}
	catch (error) {
		return { message: 'Database Error: Failed to Update Invoice.' };
	}

	revalidatePath('/dashboard/invoices');
	redirect('/dashboard/invoices');
}



export async function deleteInvoice(id: string) {

	throw new Error('Failed to Delete Invoice');

	try {
		await sql`DELETE FROM invoices WHERE id = ${id}`;
	} catch (error) {
		console.error(error);
	}

	revalidatePath('/dashboard/invoices');
}