// import {
// 	IProfileUsersCreateReq,
// 	IProfileUsersReadRes, IProfileUsersReadBulkRes,
// 	IProfileUsersUpdateReq
// } from '@/types/invoices.categories.d'


// import { axiosWithAuth } from '@/api/interceptors'
// import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation';



// export type IInvoicesCategoriesServiceCoreState = {
// 	errors?: {};
// 	message?: string;
// };



// class InvoicesCategoriesCoreService {
// 	private BASE_URL = '/invoices/categories/core'


// 	async invoicesCategoriesCreateOne(prevState: IInvoicesCategoriesServiceCoreState, data: FormData) {

// 		const response = await axiosWithAuth.post<IProfileUsersReadRes>(this.BASE_URL, data)

// 		if (![200, 201].includes(response.status)) {
// 			return {
// 				message: `Error: Received status ${response.status}`,
// 			};
// 		}

// 		revalidatePath('/dashboard/invoices');
// 		redirect('/dashboard/invoices');
// 	}




// 	async invoicesCategoriesGetMany(query: any) {

// 		const response = await axiosWithAuth.get<IProfileUsersReadBulkRes>(`${this.BASE_URL}`)

// 		if (![200, 201].includes(response.status)) {
// 			return {
// 				message: `Error: Received status ${response.status}`,
// 			};
// 		}

// 		return response.data
// 	}



// 	async invoicesCategoriesGetOne(id: number, query: any) {

// 		const response = await axiosWithAuth.get<IProfileUsersReadRes>(`${this.BASE_URL}/${id}`)

// 		if (![200, 201].includes(response.status)) {
// 			return {
// 				message: `Error: Received status ${response.status}`,
// 			};
// 		}

// 		return response.data
// 	}


// 	async invoicesCategoriesUpdateOne(prevState: IInvoicesCategoriesServiceCoreState, id: number, data: any) {

// 		const response = await axiosWithAuth.patch<IProfileUsersReadRes>(`${this.BASE_URL}/${id}`, data)

// 		if (![200, 201].includes(response.status)) {
// 			return {
// 				message: `Error: Received status ${response.status}`,
// 			};
// 		}

// 		revalidatePath('/dashboard/invoices');
// 		redirect('/dashboard/invoices');
// 	}




// 	async invoicesCategoriesDeleteOne(id: number) {

// 		const response = await axiosWithAuth.delete<IProfileUsersReadRes>(`${this.BASE_URL}/${id}`)

// 		if (![200, 201].includes(response.status)) {
// 			return {
// 				message: `Error: Received status ${response.status}`,
// 			};
// 		}

// 		revalidatePath('/dashboard/invoices');
// 		redirect('/dashboard/invoices');
// 	}

// }

// export const invoicesCategoriesCoreService = new InvoicesCategoriesCoreService()
