'use server';

import postgres from 'postgres';
import {
	UserField,
	UsersTableType,
	UserForm,
	InvoicesTable,
	LatestInvoiceRaw,
	Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'prefer' });



export async function fetchUsers() {
	try {
		const users = await sql<UserField[]>`
        SELECT
          id,
          name
        FROM users
        ORDER BY name ASC
      `;

		return users;
	} catch (err) {
		console.error('Database Error:', err);
		throw new Error('Failed to fetch all users.');
	}
}


const ITEMS_PER_PAGE = 6;
export async function fetchFilteredUsers(
	query: string,
	currentPage: number,
) {

	const offset = (currentPage - 1) * ITEMS_PER_PAGE;

	try {
		const data = await sql<UsersTableType[]>
		`SELECT
			users.id,
			users.name,
			users.email,
			users.image_url,
			COUNT(invoices.id) AS total_invoices,
			SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
			SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM users
		LEFT JOIN invoices ON users.id = invoices.user_id
		WHERE
			users.name ILIKE ${`%${query}%`} OR
      users.email ILIKE ${`%${query}%`}
		GROUP BY users.id, users.name, users.email, users.image_url
		ORDER BY users.id ASC
		LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
		`;

		const users = data.map((user) => ({
			...user,
			total_pending: formatCurrency(user.total_pending),
			total_paid: formatCurrency(user.total_paid),
		}));

		return users;
	} catch (err) {
		console.error('Database Error:', err);
		throw new Error('Failed to fetch user table.');
	}

}



export async function fetchUsersPages(query: string) {
	try {
		const data = await sql`SELECT COUNT(*)
		FROM users
		WHERE
			users.name ILIKE ${`%${query}%`} OR
			users.email ILIKE ${`%${query}%`}
	`;

		const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
		return totalPages;
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch total number of users.');
	}
}



export async function fetchUserById(id: string) {
	try {
		const data = await sql<UserForm[]>`
			SELECT
				users.id,
				users.user_id,
				users.amount,
				users.status
			FROM users
			WHERE users.id = ${id};
		`;

		const user = data.map((user) => ({
			...user,
		}));

		return user[0];
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch user.');
	}
}




//
const FormSchema = z.object({
	id: z.string(),
	name: z.string(),
	password: z.string(),
	email: z.string(),
	imageUrl: z.string()
});

const CreateUser = FormSchema.omit({ id: true });

export type State = {
	errors?: {
		name?: string[];
		password?: string[];
		email?: string[];
		imageUrl?: string[];
	};
	message?: string | null;
};


export async function createUser(prevState: State, formData: FormData) {

	// Validate form fields using Zod
	const validatedFields = CreateUser.safeParse({
		name: formData.get('name'),
		password: formData.get('password'),
		email: formData.get('email'),
		imageUrl: formData.get('imageUrl'),
	});

	console.log("!!!!!!!!!!!! validatedFields", validatedFields)


	// If form validation fails, return errors early. Otherwise, continue.
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Missing Fields. Failed to Create User.',
		};
	}


	// Prepare data for insertion into the database
	const { name, password, email, imageUrl } = validatedFields.data;
	

	//
	try {
		await sql`
				INSERT INTO users (name, password, email, image_url)
				VALUES (${name}, ${password}, ${email}, ${imageUrl})
		`;
	} catch (error) {
		return {
			message: 'Database Error: Failed to Create User.',
		};
	}

	revalidatePath('/dashboard/users');
	redirect('/dashboard/users');
}



//
const UpdateUser = FormSchema.omit({ id: true });

export async function updateUser(id: string, prevState: State, formData: FormData) {

	// Validate form fields using Zod
	const validatedFields = UpdateUser.safeParse({
		name: formData.get('name'),
		password: formData.get('password'),
		email: formData.get('email'),
		imageUrl: formData.get('imageUrl'),
	});


	// If form validation fails, return errors early. Otherwise, continue.
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Missing Fields. Failed to Update Invoice.',
		};
	}


	// Prepare data for insertion into the database
	const { name, password, email, imageUrl } = validatedFields.data;
	

	// Update the user
	try {
		await sql`
		UPDATE users
		SET name = ${name}, password = ${password}, email = ${email}, imageUrl = ${imageUrl}
		WHERE id = ${id}
	`;
	}
	catch (error) {
		return { message: 'Database Error: Failed to Update Users.' };
	}

	revalidatePath('/dashboard/users');
	redirect('/dashboard/users');
}



export async function deleteUser(id: string) {

	throw new Error('Failed to Delete User');

	try {
		await sql`DELETE FROM users WHERE id = ${id}`;
	} catch (error) {
		console.error(error);
	}

	revalidatePath('/dashboard/users');
}