import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
	IPartsCategoriesCreateReq,
	IPartsCategoriesReadRes, IPartsCategoriesReadBulkRes,
	IPartsCategoriesUpdateReq
} from '@/types/parts.categories.d'


import { apiClient } from '@/interceptors/api-client-fetch'





class PartsCategoriesService {

	private CORE_URL = '/parts/categories/core'



	public async createOne(data: any, token: string) {
		// console.log('PartsCategoriesService: createOne: data:', data);
		// console.log('PartsCategoriesService: createOne: token:', token);

		const response: any = await apiClient.post(this.CORE_URL, data, token)
		// console.log('PartsCategoriesService: createOne: response:', response);

		return response;
	}



	async findMany(query?: any, token?: string) {
		// console.log('PartsCategoriesService: findMany: query:', query);
		// console.log('PartsCategoriesService: findMany: token:', token);

		const response = await apiClient.get(this.CORE_URL, query, token)
		// console.log('PartsCategoriesService: findMany: response', response);

		return response;
	}



	async findOne(id: number, token?: string) {

		const response = await apiClient.get(`${this.CORE_URL}/${id}`, undefined, token)
		// console.log('PartsCategoriesService: findOne: response', response);

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
		// console.log('PartsCategoriesService: findOne: response', response);

		return response;
	}


	async deleteOne(id: number, token: string) {

		const response = await apiClient.delete(`${this.CORE_URL}/${id}`, token)
		// console.log('PartsCategoriesService: deleteOne: response', response);

		return response;
	}


	async totalCount() {

		const response: any = await apiClient.get(`${this.CORE_URL}/totalCount`)
		// console.log('PartsCategoriesService: totalCount: response', response);

		return response;
	}


}

export const partsCategoriesService = new PartsCategoriesService()
