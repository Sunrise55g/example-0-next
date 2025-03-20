export interface IPartsCategoriesCreateReq {
	name: string;
	description?: string;
	active?: boolean;
}


export interface IPartsCategoriesReadRes {
	id: number;
	name: string;
	description: string;
	active: boolean;
	createdAt: Date;
	updatedAt: Date;
}


export interface IPartsCategoriesReadBulkRes {
	data: IPartsCategoriesReadRes[];
	count: number;
	total: number;
	page: number;
	pageCount: number;
}


export interface IPartsCategoriesUpdateReq extends Partial<IPartsCategoriesCreateReq> { }