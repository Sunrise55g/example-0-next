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

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'prefer' });



export async function fetchRevenue() {
  try {
   
    const data = await sql<Revenue[]>`SELECT * FROM revenue`;
    return data;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}


