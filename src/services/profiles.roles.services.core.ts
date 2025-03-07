import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
	IProfileRolesCreateReq,
	IProfileRolesReadRes, IProfileRolesReadBulkRes,
	IProfileRolesUpdateReq
} from '@/types/profile.roles.d'


import { apiClient } from '@/interceptors/api.fetch.interceptor'




export type IprofilesRolesServiceCoreState = {
	errors?: {};
	message?: string;
};



class ProfilesRolesServiceCore {

	private BASE_URL = '/profile/roles/core'



	public async createOne(prevState: IprofilesRolesServiceCoreState, data: FormData, token: string) {

		const response = await apiClient.post(this.BASE_URL, data, token)

		if (![200, 201].includes(response.status)) {
			return {
				message: `Error: Received status ${response.status}`,
			};
		}

		revalidatePath('/dashboard/profile/roles');
		redirect('/dashboard/profile/roles');
	}




	async findMany(token: string, query?: any) {

		const response = await apiClient.get(this.BASE_URL, query, token)
		// console.log('profileUsersGetMany', response);

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

		revalidatePath('/dashboard/profile/roles');
		redirect('/dashboard/profile/roles');
	}




	async deleteOne(id: number, token: string) {

		const response = await apiClient.delete(`${this.BASE_URL}/${id}`, token)

		if (![200, 201].includes(response.status)) {
			return {
				message: `Error: Received status ${response.status}`,
			};
		}

		revalidatePath('/dashboard/profile/roles');
		redirect('/dashboard/profile/roles');
	}

}

export const profilesRolesServiceCore = new ProfilesRolesServiceCore()
