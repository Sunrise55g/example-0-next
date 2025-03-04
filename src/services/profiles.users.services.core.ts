import axios from 'axios'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
	IProfileUsersCreateReq,
	IProfileUsersReadRes, IProfileUsersReadBulkRes,
	IProfileUsersUpdateReq
} from '@/types/profile.users.d'


import { axiosWithAuth } from '@/api/interceptors'





export type IprofilesUsersServiceCoreState = {
	errors?: {};
	message?: string;
};



class ProfilesUsersServiceCore {

	private BASE_URL = '/profile/users/core'


	async profileUsersCreateOne(prevState: IprofilesUsersServiceCoreState, data: FormData) {

		const response = await axiosWithAuth.post<IProfileUsersReadRes>('/profile/users/core', data)

		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', response.data);

		if (![200, 201].includes(response.status)) {
			return {
				message: `Error: Received status ${response.status}`,
			};
		}

		revalidatePath('/dashboard/profile/users');
		redirect('/dashboard/profile/users');
	}




	async profileUsersGetMany(token: string, query?: any) {


		const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
		const url = `${backendUrl}${this.BASE_URL}`;

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			credentials: 'include',
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return response;

	}




	async profileUsersGetOne(id: number, query?: any) {

		const response = await axiosWithAuth.get<IProfileUsersReadRes>(`${this.BASE_URL}/${id}`)

		if (![200, 201].includes(response.status)) {
			return {
				message: `Error: Received status ${response.status}`,
			};
		}

		return response.data
	}


	async profileUsersUpdateOne(id: number, data: any) {

		const response = await axiosWithAuth.patch<IProfileUsersReadRes>(`${this.BASE_URL}/${id}`, data)

		if (![200, 201].includes(response.status)) {
			return {
				message: `Error: Received status ${response.status}`,
			};
		}

		return response.data
	}




	async profileUsersDeleteOne(id: number) {

		const response = await axiosWithAuth.delete<IProfileUsersReadRes>(`${this.BASE_URL}/${id}`)

		if (![200, 201].includes(response.status)) {
			return {
				message: `Error: Received status ${response.status}`,
			};
		}

		return response.data
	}

}

export const profilesUsersServiceCore = new ProfilesUsersServiceCore()
