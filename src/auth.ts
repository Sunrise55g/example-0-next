import NextAuth, { User, AuthError } from 'next-auth';
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod';

import { authConfig } from './auth.config';
// import type { User } from '@/types/definitions';
import { axiosClassic } from '@/api/interceptors';
import { IAuthLoginRes, IAuthRegistrationRes } from '@/types/auth';




export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({

      async authorize(credentials: any) {

        const passwordRepeat = credentials?.passwordRepeat

        if (passwordRepeat) {
        
          const parsedCredentials = z
            .object(
              {
                username: z.string(),
                password: z.string().min(6),
                passwordRepeat: z.string().min(6),
                email: z.string().email(),
                phone: z.string().optional(),
                firstName: z.string().optional(),
                lastName: z.string().optional(),
              })
            .safeParse(credentials);

          if (!parsedCredentials.success) {
            return null;
          }
          const { 
            username, password, email, phone, firstName, lastName
          } = parsedCredentials.data;


          let reqData: any = {
            username: username,
            password: password,
            email: email
          }

          if (phone) {reqData.phone = phone}
          if (firstName) {reqData.firstName = firstName}
          if (lastName) {reqData.lastName = lastName}
          
          console.log('test1:', reqData);

          const response = await axiosClassic.post(
            `/auth/registration`, reqData

          );
          console.log('response:', response.data);

          const responseData = response.data
          if (!responseData) {
            console.log('Invalid credentials');
            return null;
          }
          return {
            id: responseData.user.id.toString(),
            email: responseData.user.email,
            username: responseData.user.username,
            jwt: responseData.token,
          } as User
        }
        else {

          const parsedCredentials = z
            .object({ username: z.string(), password: z.string().min(6) })
            .safeParse(credentials);

          if (!parsedCredentials.success) {
            console.log('Invalid credentials');
            return null;
          }

          const { username, password } = parsedCredentials.data;

          const response = await axiosClassic.post<IAuthLoginRes>(
            `/auth/login`,
            { login: username, password: password }
          );

          const responseData = response.data
          if (!responseData) {
            console.log('Invalid credentials');
            return null;
          }
          return {
            id: responseData.user.id.toString(),
            email: responseData.user.email,
            username: responseData.user.username,
            jwt: responseData.token,
          } as User

        }
      },
    })

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