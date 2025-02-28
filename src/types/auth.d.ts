import { IProfileUsersReadRes } from "./profile.users";



//
export interface IAuthRegistrationReq {
	username: string;
	password: string;
	email: string;
	phone?: string;
	firstName?: string;
	lastName?: string;
}

export interface IAuthRegistrationRes {
	profile_users: IProfileUsersReadRes;
	token: string;
}


//
export interface IAuthLoginReq {
	login: string;
	password: string;
}

export interface IAuthLoginRes {
	profile_users: IProfileUsersReadRes;
	token: string;
}
