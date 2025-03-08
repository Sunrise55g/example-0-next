import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
	IProfileUsersCreateReq,
	IProfileUsersReadRes, IProfileUsersReadBulkRes,
	IProfileUsersUpdateReq
} from '@/types/profile.users.d'


import { apiClient } from '@/interceptors/api.fetch.interceptor'




class ProfileUsersService {

	private BASE_URL = '/profile/users/core'



	public async createOne(data: any, token: string) {
		// console.log('ProfileUsersServiceCore: createOne: data:', data);
		// console.log('ProfileUsersServiceCore: createOne: token:', token);

		const response: any = await apiClient.post('/profile/users/core', data, token)
		// console.log('ProfileUsersServiceCore: createOne: response:', response);

		return response;
	}




	async findMany(query?: any, token?: string) {
		// console.log('ProfileUsersServiceCore: findMany: query:', query);
		// console.log('ProfileUsersServiceCore: findMany: token:', token);

		const response = await apiClient.get(this.BASE_URL, query, token)
		// console.log('ProfileUsersServiceCore: findMany: response', response);

		return response;
	}



	async findOne(id: number, token?: string) {

		const response = await apiClient.get(`${this.BASE_URL}/${id}`, undefined, token)
		console.log('ProfileUsersServiceCore: findOne: response', response);

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
		// console.log('ProfileUsersServiceCore: findOne: response', response);

		return response;
	}




	async deleteOne(id: number, token: string) {

		const response = await apiClient.delete(`${this.BASE_URL}/${id}`, token)
		// console.log('ProfileUsersServiceCore: deleteOne: response', response);
		
		return response;
	}

}

export const profileUsersService = new ProfileUsersService()
