'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useActionState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { CheckIcon, XMarkIcon, ClockIcon, TrashIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';

import { lusitana } from '@/components/fonts';
import { UpdateButton, DeleteButton, Button } from '@/components/buttons';

import { ticketsInvoicesService } from '@/services/tickets-invoices.service';
import Link from 'next/link';




export default function TableCreateForm({
	profileUsers,
	ticketsCategories,
	onCreateSuccess,
}: {
	profileUsers: any;
	ticketsCategories: any;
	onCreateSuccess: () => void;
}) {

	// params
	const { data: session, status }: any = useSession();
	const token = session?.user?.jwt;
	const t = useTranslations('TicketsInvoices');


	//// Begin Create Action
	const [createFormVisible, setCreateFormVisible] = useState(false);

	type ICreateState = {
		errors?: {};
		message?: string;
		success?: boolean;
	};

	const createInitialState = { message: '', errors: {}, success: false };
	const [createState, createFormAction]: any = useActionState(createAction, createInitialState);


	async function createAction(prevState: ICreateState, formData: FormData) {

		let rawFormData = {
			name: formData.get('name'),
			ticketsCategoryId: formData.get('ticketsCategoryId'),
			description: formData.get('description'),
			customerUserId: formData.get('customerUserId'),
			employerUserId: formData.get('employerUserId'),
		};
		//console.log('rawFormData:', { rawFormData });

		if (rawFormData.employerUserId === 'null') {
			rawFormData.employerUserId = null;
		}

		const serviceResponse: any = await ticketsInvoicesService.createOne(rawFormData, token);

		if (serviceResponse.error || serviceResponse.message) {
			const message = serviceResponse.message;
			const statusCode = serviceResponse.statusCode;
			return {
				errors: { statusCode: message },
				message: `Error: Received status ${statusCode}`,
				success: false,
			};
		}

		setCreateFormVisible(false);

		return {
			errors: { statusCode: 201 },
			message: `Success`,
			success: true,
		};
	}

	useEffect(() => {
		if (createState.success) {
			onCreateSuccess();
		}
	}, [createState.success, onCreateSuccess]);

	//// End Create Action



	return (
		<div className="w-full rounded-md bg-gray-200 text-sm mb-5">
			{createFormVisible ? (
				<button
					onClick={(e) => {
						e.preventDefault();
						setCreateFormVisible(false);
					}}
					className="flex w-full h-10 items-center justify-center rounded-lg bg-blue-500 text-sm font-medium text-white transition-colors hover:bg-blue-400"
				>
					{t('actions.cancel')}
				</button>
			) : (
				<button
					onClick={(e) => {
						e.preventDefault();
						setCreateFormVisible(true);
					}}
					className="flex w-full h-10 items-center justify-center rounded-lg bg-blue-500 text-sm font-medium text-white transition-colors hover:bg-blue-400"
				>
					{t('actions.createTicketsInvoice')} +
				</button>
			)}

			<div
				className={`overflow-hidden transition-all duration-300 ease-in-out 
          ${createFormVisible ? 'max-h-[1000px] opacity-100 p-4' : 'max-h-0 opacity-0'}`}
			>
				<form action={createFormAction}>
					<div className="flex flex-col md:flex-row w-full items-start justify-between gap-4 mt-0 mb-2">
						<div className="w-full md:flex-1">
							<label htmlFor="name" className="text-xs text-gray-500 block mb-1">
								{t('labels.name')}:
							</label>
							<input
								id="name"
								name="name"
								type="string"
								defaultValue=""
								placeholder={t('placeholders.name')}
								className="w-full h-9 text-sm rounded-md border border-gray-200 py-0 pl-5 outline-2"
								aria-describedby="create-invoice-error"
								required
							/>
						</div>

						<div className="w-full md:flex-1">
							<label htmlFor="ticketsCategoryId" className="text-xs text-gray-500 block mb-1">
								{t('labels.ticketsCategory')}:
							</label>
							<select
								id="ticketsCategoryId"
								name="ticketsCategoryId"
								className="w-full h-9 text-sm rounded-md border border-gray-200 py-0 pl-5 outline-2 cursor-pointer"
								defaultValue=""
								aria-describedby="create-invoice-error"
								required
							>
								<option value="" disabled>
									{t('placeholders.ticketsCategory')}
								</option>
								{ticketsCategories?.data?.map((ticketsCategory: any) => (
									<option key={ticketsCategory.id} value={ticketsCategory.id}>
										{`#${ticketsCategory.id}:  ${ticketsCategory.name}`}
									</option>
								))}
							</select>
						</div>

						<div className="w-full md:flex-1">
							<label htmlFor="status" className="text-xs text-gray-500 block mb-1">
								{t('labels.status')}:
							</label>
							<select
								id="status"
								name="status"
								className="w-full h-9 text-sm rounded-md border border-gray-200 py-0 pl-5 outline-2 cursor-pointer"
								defaultValue="OPEN"
								aria-describedby="create-invoice-error"
							>
								<option value="OPEN" className="text-blue-500">
									{t('fields.statusChoices.open')}
								</option>
								<option value="CLOSED" className="text-green-500">
									{t('fields.statusChoices.closed')}
								</option>
								<option value="CANCELED" className="text-red-500">
									{t('fields.statusChoices.canceled')}
								</option>
							</select>
						</div>
					</div>

					<div className="w-full mt-2 mb-2">
						<label htmlFor="description" className="text-xs text-gray-500 block mb-1">
							{t('labels.description')}:
						</label>
						<input
							id="description"
							name="description"
							type="string"
							defaultValue=""
							placeholder={t('placeholders.description')}
							className="w-full h-9 text-sm rounded-md border border-gray-200 py-0 pl-5 outline-2"
							aria-describedby="create-invoice-error"
						/>
					</div>

					<div className="flex flex-col md:flex-row w-full items-start justify-between gap-4 mt-2 mb-2">
						<div className="w-full md:flex-1">
							<label htmlFor="customerUserId" className="text-xs text-gray-500 block mb-1">
								{t('labels.customerUser')}:
							</label>
							<select
								id="customerUserId"
								name="customerUserId"
								className="w-full h-9 text-sm rounded-md border bg-blue-300 border-gray-200 py-0 pl-5 outline-2 cursor-pointer"
								defaultValue=""
								aria-describedby="create-invoice-error"
								required
							>
								<option value="" disabled>
									{t('placeholders.customerUser')}
								</option>
								{profileUsers?.data?.map((profileUser: any) => (
									<option key={profileUser.id} value={profileUser.id}>
										{(() => {
											let result = `customerUser #${profileUser.id}: `;
											result += `${profileUser.username}, ${profileUser.email} `;
											if (profileUser.phone) result += `, ${profileUser.phone}`;
											if (profileUser.firstName) result += `, ${profileUser.firstName}`;
											if (profileUser.lastName) result += `, ${profileUser.lastName}`;
											result += `   --   `;
											result += `${t('fields.profileRole')} #${profileUser.profileRoleId}:  ${profileUser.profileRole.name}`;
											return result;
										})()}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className="flex flex-col md:flex-row w-full items-start justify-between gap-4 mt-2 mb-2">
						<div className="w-full md:flex-1">
							<label htmlFor="employerUserId" className="text-xs text-gray-500 block mb-1">
								{t('labels.employerUser')}:
							</label>
							<select
								id="employerUserId"
								name="employerUserId"
								className="w-full h-9 text-sm rounded-md border bg-red-300 border-gray-200 py-0 pl-5 outline-2 cursor-pointer"
								defaultValue=""
								aria-describedby="create-invoice-error"
							>
								<option value="" disabled>
									{t('placeholders.employerUser')}
								</option>
								<option value="null">
									{t('placeholders.employerUserNone')}
								</option>
								{profileUsers?.data?.map((profileUser: any) => (
									<option key={profileUser.id} value={profileUser.id}>
										{(() => {
											let result = `employerUser #${profileUser.id}: `;
											result += `${profileUser.username}, ${profileUser.email} `;
											if (profileUser.phone) result += `, ${profileUser.phone}`;
											if (profileUser.firstName) result += `, ${profileUser.firstName}`;
											if (profileUser.lastName) result += `, ${profileUser.lastName}`;
											result += `   --   `;
											result += `${t('fields.profileRole')} #${profileUser.profileRoleId}:  ${profileUser.profileRole.name}`;
											return result;
										})()}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className="flex flex-col md:flex-row w-full items-start justify-between gap-4 mt-3 mb-0">
						<div className="w-full md:flex-1">
							<div id="create-invoice-error" aria-live="polite" aria-atomic="true">
								{createState.errors && createState.message && (
									<p className="text-red-500 pl-5">{createState.message}</p>
								)}
							</div>
						</div>

						<div className="flex h-9 w-full justify-end gap-3">
							<Button className="bg-red-500" onClick={() => setCreateFormVisible(false)}>
								{t('actions.cancel')}
							</Button>
							<Button type="submit">{t('actions.createTicketsInvoice')}</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}