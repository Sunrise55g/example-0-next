import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// import {
// 	ITicketsCategoriesCreateReq,
// 	ITicketsCategoriesReadRes, ITicketsCategoriesReadBulkRes,
// 	ITicketsCategoriesUpdateReq
// } from '@/types/tickets.categories.d'


import { apiClient } from '@/interceptors/api.fetch.interceptor'





class TicketsCategoriesService {

	private BASE_URL = '/tickets/categories/core'



	public async createOne(data: any, token: string) {
		// console.log('TicketsCategoriesServiceCore: createOne: data:', data);
		// console.log('TicketsCategoriesServiceCore: createOne: token:', token);

		const response: any = await apiClient.post(this.BASE_URL, data, token)
		// console.log('TicketsCategoriesServiceCore: createOne: response:', response);

		return response;
	}



	async findMany(query?: any, token?: string) {
		// console.log('TicketsCategoriesServiceCore: findMany: query:', query);
		// console.log('ProfileRolesServiceCore: findMany: token:', token);

		const response = await apiClient.get(this.BASE_URL, query, token)
		// console.log('TicketsCategoriesServiceCore: findMany: response', response);

		return response;
	}



	async findOne(id: number, token?: string) {

		const response = await apiClient.get(`${this.BASE_URL}/${id}`, undefined, token)
		console.log('TicketsCategoriesServiceCore: findOne: response', response);

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

		const response = await apiClient.patch(`${this.BASE_URL}/${id}`, data, token)
		// console.log('TicketsCategoriesServiceCore: findOne: response', response);

		return response;
	}




	async deleteOne(id: number, token: string) {

		const response = await apiClient.delete(`${this.BASE_URL}/${id}`, token)
		// console.log('TicketsCategoriesServiceCore: deleteOne: response', response);

		return response;
	}

}

export const ticketsCategoriesService = new TicketsCategoriesService()
