import { DefaultSession } from "next-auth";



export type User = {
  id: string;
  token: string;
}


interface Session {
  user: {
    id: string;
    token?: string; // Добавляем свойство token
  } & DefaultSession['user'];
}

