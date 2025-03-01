import NextAuth, { User, AuthError } from 'next-auth';
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod';

import { authConfig } from './auth.config';
// import type { User } from '@/types/definitions';
import { axiosClassic } from '@/api/interceptors';
import { IAuthLoginRes } from '@/types/auth';




export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({

      async authorize(credentials) {

        //
        const parsedCredentials = z
          .object({ username: z.string(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          console.log('Invalid credentials');
          return null;
        }

        const { username, password } = parsedCredentials.data;


        //
        const response = await axiosClassic.post<IAuthLoginRes>(
          `/auth/login`,
          { login: username, password: password }
        );

        const responseData = response.data
        if (!responseData) {
          console.log('Invalid credentials');
          return null;
        }


        //
        return {
          id: responseData.user.id.toString(),
          email: responseData.user.email,
          username: responseData.user.username,
          jwt: responseData.token,
        } as User
      },
    }),

  ],

  callbacks: {
    jwt({ token, user, account }) {
      return { ...token, ...user }
    },
    session({ session, token, user }: any) {
      session.user = token as User
      return session
    },
  },
});