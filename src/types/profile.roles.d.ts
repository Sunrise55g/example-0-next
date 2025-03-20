export interface IProfileRolesCreateReq {
	name: string;
	description: string;
	administrator: boolean;
	moderator: boolean;
	active: boolean;
}


export interface IProfileRolesReadRes {
	id: number;
	name: string;
	description: string;
	administrator: boolean;
	moderator: boolean;
	active: boolean;
	createdAt: Date;
	updatedAt: Date;
}


export interface IProfileRolesReadBulkRes {
	data: IProfileRolesReadRes[];
	count: number;
	total: number;
	page: number;
	pageCount: number;
}


export interface IProfileRolesUpdateReq extends Partial<IProfileRolesCreateReq> { }