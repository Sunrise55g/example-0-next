import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// import {
// 	ITicketsItemsCreateReq,
// 	ITicketsItemsReadRes, ITicketsItemsReadBulkRes,
// 	ITicketsItemsUpdateReq
// } from '@/types/tickets.items.d'


import { apiClient } from '@/interceptors/api-client-fetch'





class TicketsItemsService {

	private CORE_URL = '/tickets/items/core'
	private CURRENT_URL = '/tickets/items/current'



	public async createOne(data: any, token: string) {
		// console.log('TicketsItemsService: createOne: data:', data);
		// console.log('TicketsItemsService: createOne: token:', token);

		const response: any = await apiClient.post(this.CORE_URL, data, token)
		// console.log('TicketsItemsService: createOne: response:', response);

		return response;
	}


	public async createOneCurrent(data: any, token: string) {
		// console.log('TicketsItemsService: createOne: data:', data);
		// console.log('TicketsItemsService: createOne: token:', token);

		const response: any = await apiClient.post(this.CURRENT_URL, data, token)
		// console.log('TicketsItemsService: createOne: response:', response);

		return response;
	}



	async findMany(query?: any, token?: string) {
		// console.log('TicketsItemsService: findMany: query:', query);
		// console.log('TicketsItemsService: findMany: token:', token);

		const response = await apiClient.get(this.CORE_URL, query, token)
		// console.log('TicketsItemsService: findMany: response', response);

		return response;
	}


	async findManyCurrent(query?: any, token?: string) {
		// console.log('TicketsItemsService: findMany: query:', query);
		// console.log('TicketsItemsService: findMany: token:', token);

		const response = await apiClient.get(this.CURRENT_URL, query, token)
		// console.log('TicketsItemsService: findMany: response', response);

		return response;
	}



	async findOne(id: number, token?: string) {

		const response = await apiClient.get(`${this.CORE_URL}/${id}`, undefined, token)
		// console.log('TicketsItemsService: findOne: response', response);

		return response;
	}


	async findOneCurrent(id: number, token?: string) {

		const response = await apiClient.get(`${this.CURRENT_URL}/${id}`, undefined, token)
		// console.log('TicketsItemsService: findOne: response', response);

		return response;
	}



	async deleteOne(id: number, token: string) {

		const response = await apiClient.delete(`${this.CORE_URL}/${id}`, token)
		// console.log('TicketsItemsService: deleteOne: response', response);

		return response;
	}


	async deleteOneCurrent(id: number, token: string) {

		const response = await apiClient.delete(`${this.CURRENT_URL}/${id}`, token)
		// console.log('TicketsItemsService: deleteOne: response', response);

		return response;
	}



	async totalCount() {

		const response: any = await apiClient.get(`${this.CORE_URL}/totalCount`)
		// console.log('TicketsItemsService: totalCount: response', response);

		return response;
	}


	async totalCountCurrent() {

		const response: any = await apiClient.get(`${this.CURRENT_URL}/totalCount`)
		// console.log('TicketsItemsService: totalCount: response', response);

		return response;
	}


}

export const ticketsItemsService = new TicketsItemsService()
