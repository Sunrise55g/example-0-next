import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
	IProfileRolesCreateReq,
	IProfileRolesReadRes, IProfileRolesReadBulkRes,
	IProfileRolesUpdateReq
} from '@/types/profile.roles.d'


import { apiClient } from '@/interceptors/api.fetch.interceptor'





class ProfileRolesService {

	private BASE_URL = '/profile/roles/core'



	public async createOne(data: any, token: string) {
		// console.log('ProfileRolesService: createOne: data:', data);
		// console.log('ProfileRolesService: createOne: token:', token);

		const response: any = await apiClient.post('/profile/roles/core', data, token)
		// console.log('ProfileRolesService: createOne: response:', response);

		return response;
	}



	async findMany(query?: any, token?: string) {
		// console.log('ProfileRolesService: findMany: query:', query);
		// console.log('ProfileRolesService: findMany: token:', token);

		const response = await apiClient.get(this.BASE_URL, query, token)
		// console.log('ProfileRolesService: findMany: response', response);

		return response;
	}



	async findOne(id: number, token?: string) {

		const response = await apiClient.get(`${this.BASE_URL}/${id}`, undefined, token)
		// console.log('ProfileRolesService: findOne: response', response);

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
		// console.log('ProfileRolesService: findOne: response', response);

		return response;
	}




	async deleteOne(id: number, token: string) {

		const response = await apiClient.delete(`${this.BASE_URL}/${id}`, token)
		// console.log('ProfileRolesService: deleteOne: response', response);

		return response;
	}

}

export const profileRolesService = new ProfileRolesService()
