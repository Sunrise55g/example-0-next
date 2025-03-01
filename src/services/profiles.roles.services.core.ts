import {
	IProfileUsersCreateReq,
	IProfileUsersReadRes, IProfileUsersReadBulkRes,
	IProfileUsersUpdateReq
} from '@/types/profile.users.d'


import { axiosWithAuth } from '@/api/interceptors'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';



export type IprofilesRolesServiceCoreState = {
	errors?: {};
	message?: string;
};



class ProfilesRolesServiceCore {

	private BASE_URL = '/profile/users/core'


	async profileUsersCreateOne(prevState: IprofilesRolesServiceCoreState, data: FormData) {

		const response = await axiosWithAuth.post<IProfileUsersReadRes>(this.BASE_URL, data)

		if (![200, 201].includes(response.status)) {
			return {
				message: `Error: Received status ${response.status}`,
			};
		}

		revalidatePath('/dashboard/users');
		redirect('/dashboard/users');
	}




	async profileUsersGetMany(query: any) {

		const response = await axiosWithAuth.get<IProfileUsersReadBulkRes>(`${this.BASE_URL}`)


		return response.data
	}



	async profileUsersGetOne(id: number, query: any) {

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

		revalidatePath('/dashboard/users');
		redirect('/dashboard/users');
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

export const profilesRolesServiceCore = new ProfilesRolesServiceCore()
