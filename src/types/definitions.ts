// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

import { DefaultSession } from "next-auth";
import { IProfileUsersReadRes } from "./profile.users";

export type User = {
	id: string;
	token: string;
}

interface Session {
  user: {
    id: string;
    token?: string; // Добавляем свойство token
  } & DefaultSession['user'];
}



export type Invoice = {
  id: string;
  user_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type UsersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedUsersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type UserField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  user_id: string;
  amount: number;
  status: 'pending' | 'paid';
};


export type UserForm = {
  id: string;
  roleId: number;
  username: string;
  password: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  image_url: string
};
