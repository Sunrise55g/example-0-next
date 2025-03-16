'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useActionState } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/buttons';

import { profileRolesService } from '@/services/profile-roles.service';




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
	const t = useTranslations('ProfileRoles');


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
			description: formData.get('description'),
			administrator: formData.get('administrator') === 'on',
			moderator: formData.get('moderator') === 'on',
			active: formData.get('active') === 'on'
		};
		//console.log('rawFormData:', { rawFormData });


		const serviceResponse: any = await profileRolesService.createOne(rawFormData, token);

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
					{t('actions.createProfileRole')} +
				</button>
			)}

			<div
				className={`overflow-hidden transition-all duration-300 ease-in-out 
          ${createFormVisible ? 'max-h-[1000px] opacity-100 p-4' : 'max-h-0 opacity-0'}`}
			>
				<form action={createFormAction}>


					<div className="flex w-full items-start gap-5 mt-0 mb-2">

						<div className="flex-1">
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
								aria-describedby="create-error"
								required
							/>
						</div>

						<div className="items-start gap-4 mt-0 mb-2">
							<label htmlFor="administrator" className="text-xs text-gray-500 block mb-1">
								{t('labels.administrator')}:
							</label>
							<input
								id="administrator"
								name="administrator"
								type="checkbox"
								className="h-9 w-9 text-sm rounded-md border border-gray-200 py-0 pl-5 outline-2 text-indigo-600 focus:ring-indigo-500"
								aria-describedby="create-error"
							/>
						</div>

						<div className="items-start gap-4 mt-0 mb-2">
							<label htmlFor="moderator" className="text-xs text-gray-500 block mb-1">
								{t('labels.moderator')}:
							</label>
							<input
								id="moderator"
								name="moderator"
								type="checkbox"
								className="h-9 w-9 text-sm rounded-md border border-gray-200 py-0 pl-5 outline-2 text-indigo-600 focus:ring-indigo-500"
								aria-describedby="create-error"
							/>
						</div>

						<div className="items-start gap-4 mt-0 mb-2">
							<label htmlFor="active" className="text-xs text-gray-500 block mb-1">
								{t('labels.active')}:
							</label>
							<input
								id="active"
								name="active"
								type="checkbox"
								className="h-9 w-9 text-sm rounded-md border border-gray-200 py-0 pl-5 outline-2 text-indigo-600 focus:ring-indigo-500"
								defaultChecked
								aria-describedby="create-error"
							/>
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
							aria-describedby="create-error"
						/>
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
							<Button type="submit">{t('actions.createProfileRole')}</Button>
						</div>

					</div>


				</form>
			</div>
		</div>
	);
}