'use server'

import { AuthError } from "next-auth";
import { signIn } from "../auth";




export async function login(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}


export async function registration(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    if(formData.get('password') !== formData.get('passwordRepeat')) return 'Пароли не совпадают'
    await signIn('credentials', formData);
    console.log('Registration: formData:', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}