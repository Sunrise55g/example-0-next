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


	public async createOneCurrent(data: any, token: string) {
		// console.log('TicketsInvoicesService: createOne: data:', data);
		// console.log('TicketsInvoicesService: createOne: token:', token);

		const response: any = await apiClient.post(this.CURRENT_URL, data, token)
		// console.log('TicketsInvoicesService: createOne: response:', response);

		return response;
	}



	async findMany(queryParams?: any, token?: string) {
		// console.log('TicketsInvoicesService: findMany: queryParams:', queryParams);
		// console.log('TicketsInvoicesService: findMany: token:', token);

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


		const response: any = await apiClient.get(this.CORE_URL, queryStr, token)
		// console.log('TicketsInvoicesService: findMany: response', response);

		return response;
	}


	async findManyCurrent(queryParams?: any, token?: string) {
		// console.log('TicketsInvoicesService: findMany: queryParams:', queryParams);
		// console.log('TicketsInvoicesService: findMany: token:', token);

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


		const response: any = await apiClient.get(this.CURRENT_URL, queryStr, token)
		// console.log('TicketsInvoicesService: findMany: response', response);

		return response;
	}



	async findOne(id: number, token?: string) {

		const response = await apiClient.get(`${this.CORE_URL}/${id}`, undefined, token)
		// console.log('TicketsInvoicesService: findOne: response', response);

		return response;
	}


	async findOneCurrent(id: number, token?: string) {

		const response = await apiClient.get(`${this.CURRENT_URL}/${id}`, undefined, token)
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


	async updateOneCurrent(id: number, data: any, token: string) {

		let dataObj = data;

		if (!dataObj.roleId || dataObj.roleId === '') {
			delete dataObj.roleId
		}

		if (!dataObj.password || dataObj.password === '') {
			delete dataObj.password
		}

		const response = await apiClient.patch(`${this.CURRENT_URL}/${id}`, data, token)

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
