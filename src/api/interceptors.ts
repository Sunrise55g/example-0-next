import axios, { type CreateAxiosDefaults } from 'axios'

import { errorCatch } from './error'
import { auth } from '@/services/auth.service';


////
const options: CreateAxiosDefaults = {
	baseURL: 'http://localhost:4000/api',
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true
}

const axiosClassic = axios.create(options)


////
const axiosWithAuth = axios.create(options)



axiosWithAuth.interceptors.request.use(async (config) => {
	const session: any = await auth();
	console.log('!!!!!!!!!!!!!!!!!! session', session)

	const token = session?.user?.jwt
	console.log('!!!!!!!!!!!!!!!!!! token', token)

	if (config?.headers && token)
		config.headers.Authorization = `Bearer ${token}`
	return config
})


axiosWithAuth.interceptors.response.use(
	config => config,
	async error => {
		const originalRequest = error.config

		if (
			(error?.response?.status === 401 ||
				errorCatch(error) === 'jwt expired' ||
				errorCatch(error) === 'jwt must be provided') &&
			error.config &&
			!error.config._isRetry
		) {
			originalRequest._isRetry = true
			// try {
			// 	return axiosWithAuth.request(originalRequest)
			// } catch (error) {
			// 	if (errorCatch(error) === 'jwt expired') signOut()
			// }
		}

		throw error
	}
)


////
export { axiosClassic, axiosWithAuth }
