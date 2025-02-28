import Cookies from 'js-cookie'

// export enum EnumTokens {
// 	'ACCESS_TOKEN' = 'accessToken',
// 	'REFRESH_TOKEN' = 'refreshToken'
// }

export const getAccessToken = () => {
	const accessToken = Cookies.get('token')
	return accessToken || null
}

export const saveTokenStorage = (token: string) => {
	Cookies.set(token, token, {
		domain: 'localhost',
		sameSite: 'strict',
		expires: 1
	})
}

export const removeFromStorage = () => {
	Cookies.remove('token')
}
