'use server';

import { AuthError } from 'next-auth';
import { signIn } from '../auth';




export async function login(prevState: string | undefined, formData: FormData) {

  try {
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      callbackUrl: '/dashboard',
    });
  }

  catch (error) {
    if (error instanceof AuthError) {
      const customMessage = (error.cause as any)?.message;

      if (customMessage) {
        return customMessage;
      }

      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return error.message;
      }
    }

    throw error;
  }
}



export async function registration(prevState: string | undefined, formData: FormData) {

  try {
    const password = formData.get('password');
    const passwordRepeat = formData.get('passwordRepeat');

    if (password !== passwordRepeat) {
      return 'Пароли не совпадают';
    }

    await signIn(
      'credentials',
      {
        ...Object.fromEntries(formData),
        callbackUrl: '/dashboard',
      }
    );
  }

  catch (error) {
    if (error instanceof AuthError) {
      const customMessage = (error.cause as any)?.message;

      if (customMessage) {
        return customMessage;
      }

      switch (error.type) {
        case 'CredentialsSignin':
          return 'Неверные учетные данные';
        case 'AccessDenied':
          return 'Доступ запрещён';
        default:
          return 'Что-то пошло не так: ' + error.message;
      }

    }

    if ((error as any).message === 'NEXT_REDIRECT') {
      throw error;
    }

    return '' + (error instanceof Error ? error.message : 'Неизвестная ошибка');
  }
}