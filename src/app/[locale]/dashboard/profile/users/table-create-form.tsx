'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useActionState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { CheckIcon, XMarkIcon, ClockIcon, TrashIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';

import { lusitana } from '@/components/fonts';
import { UpdateButton, DeleteButton, Button } from '@/components/buttons';

import { profileUsersService } from '@/services/profile-users.service';
import Link from 'next/link';




export default function TableCreateForm({
	profileRoles,
	onCreateSuccess,
}: {
	profileRoles: any;
	onCreateSuccess: () => void;
}) {

	// params
	const { data: session, status }: any = useSession();
	const token = session?.user?.jwt;
	const t = useTranslations('ProfileUsers');


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
			username: formData.get('username'),
			profileRoleId: formData.get('profileRoleId'),
			password: formData.get('password'),
			passwordRepeat: formData.get('passwordRepeat'),
			email: formData.get('email'),
			phone: formData.get('phone'),
			firstName: formData.get('firstName'),
			lastName: formData.get('lastName')
		};
		//console.log('rawFormData:', { rawFormData });

		if (rawFormData.password !== rawFormData.passwordRepeat) {
			return {
				errors: { statusCode: 400 },
				message: `Passwords do not match`,
				success: false,
			};
		}

		//
		let requestData: any = {};

		if (rawFormData.username && rawFormData.username !== '') {requestData['username'] = rawFormData.username;}
		if (rawFormData.profileRoleId) {requestData['profileRoleId'] = rawFormData.profileRoleId;}
		if (rawFormData.password && rawFormData.password !== '') {requestData['password'] = rawFormData.password;}
		if (rawFormData.email && rawFormData.email !== '') {requestData['email'] = rawFormData.email;}
		if (rawFormData.phone && rawFormData.phone !== '') {requestData['phone'] = rawFormData.phone;}
		if (rawFormData.firstName && rawFormData.firstName !== '') {requestData['firstName'] = rawFormData.firstName;}
		if (rawFormData.lastName && rawFormData.lastName !== '') {requestData['lastName'] = rawFormData.lastName;}

		//
		const serviceResponse: any = await profileUsersService.createOne(requestData, token);

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
			message: '',
			errors: {},
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
					{t('actions.createProfileUser')} +
				</button>
			)}

			<div
				className={`overflow-hidden transition-all duration-300 ease-in-out 
          ${createFormVisible ? 'max-h-[1000px] opacity-100 p-4' : 'max-h-0 opacity-0'}`}
			>
				<form action={createFormAction}>


					<div className="flex w-full items-start gap-5 mt-0 mb-2">

						<div className="flex-1">
							<label htmlFor="username" className="text-xs text-gray-500 block mb-1">
								{t('labels.username')}:
							</label>
							<input
								id="username"
								name="username"
								type="string"
								defaultValue=""
								placeholder={t('placeholders.username')}
								className="w-full h-9 text-sm rounded-md border border-gray-200 py-0 pl-5 outline-2"
								aria-describedby="create-error"
								required
							/>
						</div>
					</div>


					<div className="w-full mt-2 mb-2">
						<label htmlFor="profileRoleId" className="text-xs text-gray-500 block mb-1">
							{t('labels.profileRole')}:
						</label>
						<select
							id="profileRoleId"
							name="profileRoleId"
							className="w-full h-9 text-sm rounded-md border bg-green-200 border-gray-200 py-0 pl-5 outline-2 cursor-pointer"
							defaultValue=""
							aria-describedby="create-error"
							required
						>
							<option value="" disabled>
								{t('placeholders.profileRole')}
							</option>
							{profileRoles?.data?.map((profileRole: any) => (
								<option key={profileRole.id} value={profileRole.id}>
									{`#${profileRole.id}:  ${profileRole.name}`}
								</option>
							))}
						</select>
					</div>


					<div className="flex w-full items-start gap-5 mt-0 mb-2">

						<div className="flex-1">
							<label htmlFor="password" className="text-xs text-gray-500 block mb-1">
								{t('labels.password')}:
							</label>
							<input
								id="password"
								name="password"
								type="password"
								defaultValue=""
								placeholder={t('placeholders.password')}
								className="w-full h-9 text-sm rounded-md border bg-red-200 border-gray-200 py-0 pl-5 outline-2"
								aria-describedby="create-error"
								required
							/>
						</div>

						<div className="flex-1">
							<label htmlFor="passwordRepeat" className="text-xs text-gray-500 block mb-1">
								{t('labels.passwordRepeat')}:
							</label>
							<input
								id="passwordRepeat"
								name="passwordRepeat"
								type="password"
								defaultValue=""
								placeholder={t('placeholders.phone')}
								className="w-full h-9 text-sm rounded-md border bg-red-200 border-gray-200 py-0 pl-5 outline-2"
								aria-describedby="create-error"
								required
							/>
						</div>

					</div>


					<div className="flex w-full items-start gap-5 mt-0 mb-2">

						<div className="flex-1">
							<label htmlFor="email" className="text-xs text-gray-500 block mb-1">
								{t('labels.email')}:
							</label>
							<input
								id="email"
								name="email"
								type="string"
								defaultValue=""
								placeholder={t('placeholders.email')}
								className="w-full h-9 text-sm rounded-md border border-gray-200 py-0 pl-5 outline-2"
								aria-describedby="create-error"
								required
							/>
						</div>

						<div className="flex-1">
							<label htmlFor="phone" className="text-xs text-gray-500 block mb-1">
								{t('labels.phone')}:
							</label>
							<input
								id="phone"
								name="phone"
								type="string"
								defaultValue=""
								placeholder={t('placeholders.phone')}
								className="w-full h-9 text-sm rounded-md border border-gray-200 py-0 pl-5 outline-2"
								aria-describedby="create-error"
							/>
						</div>

					</div>


					<div className="flex w-full items-start gap-5 mt-0 mb-2">

						<div className="flex-1">
							<label htmlFor="firstName" className="text-xs text-gray-500 block mb-1">
								{t('labels.firstName')}:
							</label>
							<input
								id="firstName"
								name="firstName"
								type="string"
								defaultValue=""
								placeholder={t('placeholders.firstName')}
								className="w-full h-9 text-sm rounded-md border border-gray-200 py-0 pl-5 outline-2"
								aria-describedby="create-error"
							/>
						</div>

						<div className="flex-1">
							<label htmlFor="lastName" className="text-xs text-gray-500 block mb-1">
								{t('labels.lastName')}:
							</label>
							<input
								id="lastName"
								name="lastName"
								type="string"
								defaultValue=""
								placeholder={t('placeholders.lastName')}
								className="w-full h-9 text-sm rounded-md border border-gray-200 py-0 pl-5 outline-2"
								aria-describedby="create-error"
							/>
						</div>

					</div>


					<div className="flex flex-col md:flex-row w-full items-start justify-between gap-4 mt-3 mb-0">

						<div className="w-full md:flex-1">
							<div id="create-error" aria-live="polite" aria-atomic="true">
								{createState.errors && createState.message && createState.message !== 'Success' && (
									<p className="text-red-500 text-m flex w-full py-3 pl-5">{createState.message}</p>
								)}
								{createState.errors && createState.message && createState.message === 'Success' && (
									<p className="text-green-500 text-m flex w-full py-3 pl-5">{t('messages.success')}</p>
								)}
							</div>
						</div>

						<div className="flex h-9 w-full justify-end gap-3">
							<Button className="bg-red-500" onClick={() => setCreateFormVisible(false)}>
								{t('actions.cancel')}
							</Button>
							<Button type="submit">{t('actions.createProfileUser')}</Button>
						</div>

					</div>


				</form>
			</div>
		</div>
	);
}