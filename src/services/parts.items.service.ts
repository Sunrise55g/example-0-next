import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
	IPartsItemsCreateReq,
	IPartsItemsReadRes, IPartsItemsReadBulkRes,
	IPartsItemsUpdateReq
} from '@/types/parts.items.d'


import { apiClient } from '@/interceptors/api.fetch.interceptor'





class PartsItemsService {

	private BASE_URL = '/parts/items/core'



	public async createOne(data: any, token: string) {
		// console.log('PartsItemsService: createOne: data:', data);
		// console.log('PartsItemsService: createOne: token:', token);

		const response: any = await apiClient.post(this.BASE_URL, data, token)
		// console.log('PartsItemsService: createOne: response:', response);

		return response;
	}



	async findMany(query?: any, token?: string) {
		// console.log('PartsItemsService: findMany: query:', query);
		// console.log('PartsItemsService: findMany: token:', token);

		const response = await apiClient.get(this.BASE_URL, query, token)
		// console.log('PartsItemsService: findMany: response', response);

		return response;
	}



	async findOne(id: number, token?: string) {

		const response = await apiClient.get(`${this.BASE_URL}/${id}`, undefined, token)
		console.log('PartsItemsServiceCore: findOne: response', response);

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
		// console.log('PartsItemsService: findOne: response', response);

		return response;
	}




	async deleteOne(id: number, token: string) {

		const response = await apiClient.delete(`${this.BASE_URL}/${id}`, token)
		// console.log('PartsItemsService: deleteOne: response', response);

		return response;
	}

}

export const partsItemsService = new PartsItemsService()
