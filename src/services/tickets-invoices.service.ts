import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// import {
// 	ITicketsInvoicesCreateReq,
// 	ITicketsInvoicesReadRes, ITicketsInvoicesReadBulkRes,
// 	ITicketsInvoicesUpdateReq
// } from '@/types/tickets.invoices.d'


import { apiClient } from '@/interceptors/api-client-fetch'





class TicketsInvoicesService {

	private CORE_URL = '/tickets/invoices/core'
	private CURRENT_URL = '/tickets/invoices/current'



	public async createOne(data: any, token: string) {
		// console.log('TicketsInvoicesService: createOne: data:', data);
		// console.log('TicketsInvoicesService: createOne: token:', token);

		const response: any = await apiClient.post(this.CORE_URL, data, token)
		// console.log('TicketsInvoicesService: createOne: response:', response);

		return response;
	}



	async findMany(query?: any, token?: string) {
		// console.log('TicketsInvoicesService: findMany: query:', query);
		// console.log('TicketsInvoicesService: findMany: token:', token);

		const response: any = await apiClient.get(this.CORE_URL, query, token)
		// console.log('TicketsInvoicesService: findMany: response', response);

		return response;
	}



	async findOne(id: number, token?: string) {

		const response = await apiClient.get(`${this.CORE_URL}/${id}`, undefined, token)
		// console.log('TicketsInvoicesService: findOne: response', response);

		return response;
	}



	async updateOne(id: number, data: any, token: string) {

		let dataObj = data;

		if (!dataObj.roleId || dataObj.roleId === '') {
			delete dataObj.roleId
		}

		if (!dataObj.password || dataObj.password === '') {
			delete dataObj.password
		}

		const response = await apiClient.patch(`${this.CORE_URL}/${id}`, data, token)
		// console.log('TicketsInvoicesService: findOne: response', response);

		return response;
	}




	async deleteOne(id: number, token: string) {

		const response = await apiClient.delete(`${this.CORE_URL}/${id}`, token)
		// console.log('TicketsInvoicesService: deleteOne: response', response);

		return response;
	}



	async totalCountCore(token: string) {

		const response: any = await apiClient.get(`${this.CORE_URL}/totalCount`, undefined, token)
		// console.log('TicketsInvoicesService: totalCountCore: response', response);

		return response;
	}


	async totalCountCurrent(token: string) {

		const response: any = await apiClient.get(`${this.CURRENT_URL}/totalCount`, undefined, token)
		// console.log('TicketsInvoicesService: totalCountCurrent: response', response);

		return response;
	}


	async statsByDaysCore(token: string) {

		const response: any = await apiClient.get(`${this.CORE_URL}/statsByDays`, undefined, token)
		// console.log('TicketsInvoicesService: statsByDaysCore: response', response);

		return response;
	}


	async statsByDaysCurrent(token: string) {

		const response: any = await apiClient.get(`${this.CURRENT_URL}/statsByDays`, undefined, token)
		// console.log('TicketsInvoicesService: statsByDaysCurrent: response', response);

		return response;
	}

}

export const ticketsInvoicesService = new TicketsInvoicesService()
