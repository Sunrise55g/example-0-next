import type { NextAuthConfig } from 'next-auth';



export const authConfig = {
	pages: {
		signIn: '/auth/login',
	},
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;
			return isLoggedIn
		},
	},
	providers: [],
} satisfies NextAuthConfig;