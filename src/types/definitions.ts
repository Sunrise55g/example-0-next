import { DefaultSession } from "next-auth";
import { IProfileUsersReadRes } from "./profile.users";



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

