import axios, { type CreateAxiosDefaults } from 'axios'
import { Session } from 'next-auth'

import { errorCatch } from './error'
import { auth } from '@/auth';
import { useSession } from 'next-auth/react';



async function getToken(): Promise<string | null> {
	// Проверяем, выполняется ли код на сервере
	if (typeof window === 'undefined') {

	  // На сервере используем auth()
	  const session = await auth();
	  console.log('Session in getToken:', session?.user?.jwt || null);

	  return session?.user?.jwt || null;
	} 
	else {
	  // На клиенте используем useSession()
	  const { data: session } = useSession();
	  console.log('Session in getToken:', session?.user?.jwt || null);

	  return session?.user?.jwt || null;
	}
  }




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

	const token = await getToken();

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
