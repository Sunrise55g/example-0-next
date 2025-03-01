import {
	IProfileUsersCreateReq,
	IProfileUsersReadRes, IProfileUsersReadBulkRes,
	IProfileUsersUpdateReq
} from '@/types/profile.users.d'


import { axiosWithAuth } from '@/api/interceptors'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';



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




	async profileUsersGetMany(query?: any) {

		const response = await axiosWithAuth.get<IProfileUsersReadBulkRes>(`${this.BASE_URL}`)

		return response.data
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
