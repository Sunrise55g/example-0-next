import { IPartsCategoriesReadRes } from "./parts.categories";



export interface IPartsItemsCreateReq {
	partsCategoryId: number;
	name: string;
	description: string;
	active: boolean;
}


export interface IPartsItemsReadRes {
	id: number;
	partsCategoryId: number;
	partsCategory: IPartsCategoriesReadRes;
	name: string;
	description: string;
	active: boolean;
	createdAt: Date;
	updatedAt: Date;
}


export interface IPartsItemsReadBulkRes {
	data: IPartsItemsReadRes[];
	count: number;
	total: number;
	page: number;
	pageCount: number;
}


export interface IPartsItemsUpdateReq extends Partial<IPartsItemsCreateReq> { }