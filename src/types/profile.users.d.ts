import { IProfileRolesReadRes } from "./profile.roles";


export interface IProfileUsersCreateReq {
	profileRoleId: number;
	username: string;
	password: string;
	email: string;
	phone: string;
	firstName: string;
	lastName: string;
}


export interface IProfileUsersReadRes {
	id: number;
	profileRoleId: number;
	profile_roles: IProfileRolesReadRes;
	username: string;
	email: string;
	phone: string;
	firstName: string;
	lastName: string;
	active: boolean;
	createdAt: Date;
	updatedAt: Date;
}


export interface IProfileUsersReadBulkRes {
	data: ProfileUsersReadRes[];
	count: number;
	total: number;
	page: number;
	pageCount: number;
}


export interface IProfileUsersUpdateReq extends Partial<IProfileUsersCreateReq> { }


export interface ProfileUsersUpdatePasswordReq {
	oldPassword: string;
	newPassword: string;
}