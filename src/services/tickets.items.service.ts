import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// import {
// 	ITicketsItemsCreateReq,
// 	ITicketsItemsReadRes, ITicketsItemsReadBulkRes,
// 	ITicketsItemsUpdateReq
// } from '@/types/tickets.items.d'


import { apiClient } from '@/interceptors/api.fetch.interceptor'





class TicketsItemsService {

	private CORE_URL = '/tickets/items/core'
	private CURRENT_URL = '/tickets/items/current'



	public async createOne(data: any, token: string) {
		// console.log('TicketsItemsServiceCore: createOne: data:', data);
		// console.log('TicketsItemsServiceCore: createOne: token:', token);

		const response: any = await apiClient.post(this.CORE_URL, data, token)
		// console.log('TicketsItemsServiceCore: createOne: response:', response);

		return response;
	}



	async findMany(query?: any, token?: string) {
		// console.log('TicketsItemsServiceCore: findMany: query:', query);
		// console.log('TicketsItemsServiceCore: findMany: token:', token);

		const response = await apiClient.get(this.CORE_URL, query, token)
		// console.log('TicketsItemsServiceCore: findMany: response', response);

		return response;
	}



	async findOne(id: number, token?: string) {

		const response = await apiClient.get(`${this.CORE_URL}/${id}`, undefined, token)
		console.log('TicketsItemsServiceCore: findOne: response', response);

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
		// console.log('TicketsItemsServiceCore: findOne: response', response);

		return response;
	}




	async deleteOne(id: number, token: string) {

		const response = await apiClient.delete(`${this.CORE_URL}/${id}`, token)
		// console.log('TicketsItemsServiceCore: deleteOne: response', response);

		return response;
	}



	async totalCount() {

		const response: any = await apiClient.get(`${this.CURRENT_URL}/totalCount`)
		console.log('ProfileUsersServiceCore: findOne: response', response);

		return response;
	}


}

export const ticketsItemsService = new TicketsItemsService()
