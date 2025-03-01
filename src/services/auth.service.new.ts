// 'use server'

// import { axiosClassic } from '@/api/interceptors'
// import { removeFromStorage, saveTokenStorage } from './auth-token.service'
// import {
// 	IAuthRegistrationReq, IAuthRegistrationRes,
// 	IAuthLoginReq, IAuthLoginRes
// } from '@/types/auth'





// export async function registration(data: IAuthRegistrationReq) {
// 	const response = await axiosClassic.post<IAuthRegistrationRes>(
// 		`/auth/registration`,
// 		data
// 	)

// 	if (response.data.token) saveTokenStorage(response.data.token)

// 	return response
// }


// export async function login(
// 	prevState: 'Success' | "Something went wrong." | undefined,
// 	formData: FormData
// ) {
// 	// Преобразуем FormData в IAuthLoginReq
// 	const data: IAuthLoginReq = {
// 		login: formData.get('login') as string,
// 		password: formData.get('password') as string,
// 	};
	

// 	try {
// 		const response = await axiosClassic.post<IAuthLoginRes>(
// 			`/auth/login`,
// 			data
// 		);
// 		console.log('response', { response });

// 		if (response.data.token) {
// 			saveTokenStorage(response.data.token);
// 			return 'Success';
// 		} else {
// 			return 'Something went wrong.';
// 		}
// 	} catch (error) {
// 		console.error('Login failed:', error);
// 		return 'Something went wrong.';
// 	}
// }


// export async function refresh() {
// 	const response = await axiosClassic.post<{ token: string }>(
// 		'/auth/refresh'
// 	)

// 	if (response.data.token) saveTokenStorage(response.data.token)

// 	return response
// }


// export async function verify() {
// 	const response = await axiosClassic.post<{ verify: true }>(
// 		'/auth/verify'
// 	)

// 	return response
// }


// export async function logout() {
// 	// const response = await axiosClassic.post<boolean>('/auth/logout')
// 	// if (response.data) removeFromStorage()
// 	// return response

// 	removeFromStorage()
// 	return null;
// }

