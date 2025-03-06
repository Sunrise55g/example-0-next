import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
	IProfileUsersCreateReq,
	IProfileUsersReadRes, IProfileUsersReadBulkRes,
	IProfileUsersUpdateReq
} from '@/types/profile.users.d'


import { apiClient } from '@/interceptors/api.fetch.interceptor'




export type IprofilesUsersServiceCoreState = {
	errors?: {};
	message?: string;
};



class ProfilesUsersServiceCore {

	private BASE_URL = '/profile/users/core'



	public async createOne(data: any, token: string) {
		// console.log('data:', data);
		// console.log('token:', token);

		const response: any = await apiClient.post('/profile/users/core', data, token)
		// console.log('response:', response);

		return response;
	}




	async findMany(query?: any, token?: string) {
		// console.log('findMany: query:', query);
		// console.log('findMany: token:', token);

		const response = await apiClient.get(this.BASE_URL, query, token)
		console.log('profileUsersGetMany', response);

		return response;
	}



	async findOne(id: number, query?: any) {

		const response = await apiClient.get(`${this.BASE_URL}/${id}`)

		if (![200, 201].includes(response.status)) {
			return {
				message: `Error: Received status ${response.status}`,
			};
		}

		return response
	}



	async updateOne(id: number, data: any, token: string) {

		const response = await apiClient.patch(`${this.BASE_URL}/${id}`, data, token)

		if (![200, 201].includes(response.status)) {
			return {
				message: `Error: Received status ${response.status}`,
			};
		}

		revalidatePath('/dashboard/profile/users');
		redirect('/dashboard/profile/users');
	}




	async deleteOne(id: number, token: string) {

		const response = await apiClient.delete(`${this.BASE_URL}/${id}`, token)

		if (![200, 201].includes(response.status)) {
			return {
				message: `Error: Received status ${response.status}`,
			};
		}

		revalidatePath('/dashboard/profile/users');
		redirect('/dashboard/profile/users');
	}

}

export const profilesUsersServiceCore = new ProfilesUsersServiceCore()
