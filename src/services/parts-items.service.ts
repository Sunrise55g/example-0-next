// import {
// 	IPartsItemsCreateReq,
// 	IPartsItemsReadRes, IPartsItemsReadBulkRes,
// 	IPartsItemsUpdateReq
// } from '@/types/parts.items.d'


import { apiClient } from '@/interceptors/api-client-fetch'





class PartsItemsService {

	private CORE_URL = '/parts/items/core'
	private CURRENT_URL = '/parts/items/current'



	public async createOne(data: any, token: string) {
		// console.log('PartsItemsService: createOne: data:', data);
		// console.log('PartsItemsService: createOne: token:', token);

		const response: any = await apiClient.post(this.CORE_URL, data, token)
		// console.log('PartsItemsService: createOne: response:', response);

		return response;
	}



	async findMany(queryParams?: any, token?: string) {
		// console.log('PartsItemsService: findMany: query:', query);
		// console.log('PartsItemsService: findMany: token:', token);


		////
		let queryStr = '';

		if (queryParams?.page) {
			queryStr += `?page=${queryParams.page}`;
		}

		if (queryParams?.sort) {
			queryStr += `&sort=${queryParams.sort}`;
		}

		if (queryParams?.query) {
			queryStr += `&filter=name||$cont||${queryParams.query}`;
			queryStr += `&filter=description||$cont||${queryParams.query}`;
		}


		const response = await apiClient.get(this.CORE_URL, queryStr, token)
		// console.log('PartsItemsService: findMany: response', response);

		return response;
	}



	async findOne(id: number, token?: string) {

		const response = await apiClient.get(`${this.CORE_URL}/${id}`, undefined, token)
		// console.log('PartsItemsService: findOne: response', response);

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
		// console.log('PartsItemsService: findOne: response', response);

		return response;
	}



	async deleteOne(id: number, token: string) {

		const response = await apiClient.delete(`${this.CORE_URL}/${id}`, token)
		// console.log('PartsItemsService: deleteOne: response', response);

		return response;
	}


	async totalCount() {

		const response: any = await apiClient.get(`${this.CORE_URL}/totalCount`)
		// console.log('PartsItemsService: totalCount: response', response);

		return response;
	}

}

export const partsItemsService = new PartsItemsService()
