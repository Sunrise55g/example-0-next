// import {
// 	IProfileUsersCreateReq,
// 	IProfileUsersReadRes, IProfileUsersReadBulkRes,
// 	IProfileUsersUpdateReq
// } from '@/types/profile.users.d'


import { apiClient } from '@/interceptors/api-client-fetch'




class ProfileUsersService {

	private CORE_URL = '/profile/users/core'
	private CURRENT_URL = '/profile/users/current'



	public async createOne(data: any, token: string) {
		// console.log('ProfileUsersService: createOne: data:', data);
		// console.log('ProfileUsersService: createOne: token:', token);

		const response: any = await apiClient.post('/profile/users/core', data, token)
		// console.log('ProfileUsersService: createOne: response:', response);

		return response;
	}




	async findMany(queryParams?: any, token?: string) {
		// console.log('ProfileUsersService: findMany: query:', query);
		// console.log('ProfileUsersService: findMany: token:', token);


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
		}


		const response = await apiClient.get(this.CORE_URL, queryStr, token)
		// console.log('ProfileUsersService: findMany: response', response);

		return response;
	}



	async findOne(id: number, token?: string) {

		const response = await apiClient.get(`${this.CORE_URL}/${id}`, undefined, token)
		// console.log('ProfileUsersService: findOne: response', response);

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
		// console.log('ProfileUsersService: findOne: response', response);

		return response;
	}



	async deleteOne(id: number, token: string) {

		const response = await apiClient.delete(`${this.CORE_URL}/${id}`, token)
		// console.log('ProfileUsersService: deleteOne: response', response);

		return response;
	}



	async totalCount() {

		const response: any = await apiClient.get(`${this.CORE_URL}/totalCount`)
		// console.log('ProfileUsersService: totalCount: response', response);

		return response;
	}


	async getCurrent(token: string) {

		const response: any = await apiClient.get(`${this.CURRENT_URL}`, undefined, token)
		// console.log('ProfileUsersService: getCurrent: response', response);

		return response;
	}


}

export const profileUsersService = new ProfileUsersService()
