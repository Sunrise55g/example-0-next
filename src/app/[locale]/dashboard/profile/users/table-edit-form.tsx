'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/buttons';

import { profileUsersService } from '@/services/profile-users.service';




export default function TableEditForm({
  profileRoles,
  profileUser,
  onUpdateSuccess,
}: {
  profileRoles: any;
  profileUser: any;
  onUpdateSuccess: () => void;
}) {

  // params
  const { data: session }: any = useSession();
  const token = session?.user?.jwt;
  const t = useTranslations('ProfileUsers');


  //// Begin Update Action
  const [editFormVisible, setEditFormVisible] = useState(false);

  type IUpdateState = {
    errors?: {};
    message?: string;
    success?: boolean;
  };

  const updateInitialState = { message: '', errors: {}, success: false };
  const [updateState, updateFormAction]: any = useActionState(updateAction, updateInitialState);


  async function updateAction(prevState: IUpdateState, formData: FormData) {

    //
    const id = formData.get('id');

    if (!id) {
      return {
        errors: { statusCode: 400 },
        message: `Error: Received status 400`,
        success: false,
      };
    }

    //
    const rawFormData = {
      username: formData.get('username'),
      active: formData.get('active') === 'on',
      profileRoleId: formData.get('profileRoleId'),
      password: formData.get('password'),
      passwordRepeat: formData.get('passwordRepeat'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName')
    };
    console.log('rawFormData (update):', { id, ...rawFormData });


    if (rawFormData.password !== rawFormData.passwordRepeat) {
      return {
        errors: { statusCode: 400 },
        message: `Passwords do not match`,
        success: false,
      };
    }

    //
    let requestData: any = {};

    if (rawFormData.username && rawFormData.username !== '' && rawFormData.username !== profileUser.username) {
      requestData['username'] = rawFormData.username;
    }

    if (rawFormData.active == true && profileUser.active != true) {
      requestData['active'] = true;
    }
    if (rawFormData.active == false && profileUser.active != false) {
      requestData['active'] = false;
    }

    if (rawFormData.profileRoleId && rawFormData.profileRoleId !== profileUser.profileRoleId) {
      if (rawFormData.profileRoleId == 'null') {
        requestData['profileRoleId'] = null;
      }
      requestData['profileRoleId'] = rawFormData.profileRoleId;
    }

    if (rawFormData.password && rawFormData.password !== '') {
      requestData['password'] = rawFormData.password;
    }

    if (rawFormData.email && rawFormData.email !== '' && rawFormData.email !== profileUser.email) {
      requestData['email'] = rawFormData.email;
    }

    if (rawFormData.phone && rawFormData.phone !== '' && rawFormData.phone !== profileUser.phone) {
      requestData['phone'] = rawFormData.phone;
    }

    if (rawFormData.firstName && rawFormData.firstName !== '' && rawFormData.firstName !== profileUser.firstName) {
      requestData['firstName'] = rawFormData.firstName;
    }

    if (rawFormData.lastName && rawFormData.lastName !== '' && rawFormData.lastName !== profileUser.lastName) {
      requestData['lastName'] = rawFormData.lastName;
    }

    console.log('requestData (update):', { requestData });


    //
    const serviceResponse: any = await profileUsersService.updateOne(+id, requestData, token);

    if (serviceResponse.error || serviceResponse.message) {
      const message = serviceResponse.message;
      const statusCode = serviceResponse.statusCode;
      return {
        errors: { statusCode: message },
        message: `Error: Received status ${statusCode}`,
        success: false,
      };
    }

    setEditFormVisible(false);

    return {
      errors: { statusCode: 200 },
      message: `Success`,
      success: true,
    };
  }


  useEffect(() => {
    if (updateState.success) {
      onUpdateSuccess();
    }
  }, [updateState.success, onUpdateSuccess]);

  //// End Update Action


  //// Begin Delete Action
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  type IDeleteState = {
    errors?: {};
    message?: string;
    success?: boolean;
  };

  const deleteInitialState = { message: '', errors: {}, success: false };
  const [deleteState, deleteFormAction]: any = useActionState(deleteAction, deleteInitialState);


  async function deleteAction(prevState: IDeleteState, formData: FormData) {
    const id = formData.get('id');
    // console.log('deleteAction - id:', id);

    if (!id) {
      return {
        errors: { statusCode: 400 },
        message: `Error: Received status 400 - Invalid ID`,
        success: false,
      };
    }

    const serviceResponse: any = await profileUsersService.deleteOne(+id, token);

    if (serviceResponse.error || serviceResponse.message) {
      const message = serviceResponse.message;
      const statusCode = serviceResponse.statusCode;
      return {
        errors: { statusCode: message },
        message: `Error: Received status ${statusCode}`,
        success: false,
      };
    }

    return {
      errors: { statusCode: 204 },
      message: `Success`,
      success: true,
    };
  }


  useEffect(() => {
    if (deleteState.success) {
      onUpdateSuccess();
      setIsDeleteModalOpen(false);
    }
  }, [deleteState.success, onUpdateSuccess]);

  //// End Delete Action




  return (
    <div className="w-full rounded-md bg-gray-200 text-sm p-4 mb-5 mt-5">


      {/* Begin Update Form */}
      <form action={updateFormAction}>

        <h2 className="flex justify-between items-center text-lg font-semibold text-gray-700 mb-3">
          <span>{t('labels.profileUser')} #{profileUser.id}</span>
          <span className="text-sm font-normal">
            {t('labels.createdAt')}: {new Date(profileUser.createdAt).toLocaleString()} |{' '}
            {t('labels.updatedAt')}: {new Date(profileUser.updatedAt).toLocaleString()}
          </span>
        </h2>

        <input type="hidden" name="id" value={profileUser.id} />


        <div className="flex w-full items-start gap-5 mt-0 mb-2">

          <div className="flex-1">
            <label htmlFor="username" className="text-xs text-gray-500 block mb-1">
              {t('labels.username')}:
            </label>
            <input
              id="username"
              name="username"
              type="string"
              defaultValue={profileUser.username}
              placeholder={t('placeholders.username')}
              className={
                `w-full h-9 text-sm rounded-md border py-0 pl-5 
                ${editFormVisible ? 'border-green-500 outline-2' : 'border-gray-200'}`
              }
              disabled={!editFormVisible}
              aria-describedby="update-error"
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
              className={
                `h-9 w-9 text-sm rounded-md border py-0 pl-5 text-indigo-600 focus:ring-indigo-500
                ${editFormVisible ? 'border-green-500 outline-2' : 'border-gray-200'}`
              }
              disabled={!editFormVisible}
              defaultChecked={profileUser.active}
              aria-describedby="update-error"
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
            className={
              `w-full h-9 text-sm rounded-md border py-0 pl-5 
                ${editFormVisible ? 'border-green-500 outline-2 cursor-pointer' : 'border-gray-200'}`
            }
            disabled={!editFormVisible}
            defaultValue={profileUser.profileRoleId}
            key={profileUser.profileRoleId}
            aria-describedby="update-error"
          >
            <option value="" disabled>
              {t('placeholders.profileRole')}
            </option>
            <option value="null">
              {t('placeholders.profileRoleNone')}
            </option>
            {profileRoles?.data?.map((profileRole: any) => (
              <option key={profileRole.id} value={profileRole.id}>
                {`#${profileRole.id}:  ${profileRole.name}`}
              </option>
            ))}
          </select>
        </div>


        {editFormVisible && (

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
                className={
                  `w-full h-9 text-sm rounded-md border py-0 pl-5 
                ${editFormVisible ? 'border-green-500 outline-2' : 'border-gray-200'}`
                }
                disabled={!editFormVisible}
                hidden={!editFormVisible}
                aria-describedby="update-error"
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
                placeholder={t('placeholders.passwordRepeat')}
                className={
                  `w-full h-9 text-sm rounded-md border py-0 pl-5 
                ${editFormVisible ? 'border-green-500 outline-2' : 'border-gray-200'}`
                }
                disabled={!editFormVisible}
                aria-describedby="update-error"
              />
            </div>

          </div>

        )}


        <div className="flex w-full items-start gap-5 mt-0 mb-2">

          <div className="flex-1">
            <label htmlFor="email" className="text-xs text-gray-500 block mb-1">
              {t('labels.email')}:
            </label>
            <input
              id="email"
              name="email"
              type="string"
              defaultValue={profileUser.email}
              placeholder={t('placeholders.email')}
              className={
                `w-full h-9 text-sm rounded-md border py-0 pl-5 
                  ${editFormVisible ? 'border-green-500 outline-2' : 'border-gray-200'}`
              }
              disabled={!editFormVisible}
              aria-describedby="update-error"
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
              defaultValue={profileUser.phone}
              placeholder={t('placeholders.phone')}
              className={
                `w-full h-9 text-sm rounded-md border py-0 pl-5 
                  ${editFormVisible ? 'border-green-500 outline-2' : 'border-gray-200'}`
              }
              disabled={!editFormVisible}
              aria-describedby="update-error"
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
              defaultValue={profileUser.firstName}
              placeholder={t('placeholders.firstName')}
              className={
                `w-full h-9 text-sm rounded-md border py-0 pl-5 
                  ${editFormVisible ? 'border-green-500 outline-2' : 'border-gray-200'}`
              }
              disabled={!editFormVisible}
              aria-describedby="update-error"
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
              defaultValue={profileUser.lastName}
              placeholder={t('placeholders.lastName')}
              className={
                `w-full h-9 text-sm rounded-md border py-0 pl-5 
                  ${editFormVisible ? 'border-green-500 outline-2' : 'border-gray-200'}`
              }
              disabled={!editFormVisible}
              aria-describedby="update-error"
            />
          </div>

        </div>


        <div className="flex flex-col md:flex-row w-full items-start justify-between gap-4 mt-2 mb-2">
          <div className="w-full md:flex">
            <div id="update-error" aria-live="polite" aria-atomic="true">
              {updateState.errors && updateState.message && updateState.message !== 'Success' && (
                <p className="text-red-500 text-m flex w-full py-3 pl-5">{updateState.message}</p>
              )}
              {updateState.errors && updateState.message && updateState.message === 'Success' && (
                <p className="text-green-500 text-m flex w-full py-3 pl-5">{t("messages.success")}</p>
              )}
            </div>
            <div id="delete-error" aria-live="polite" aria-atomic="true">
              {deleteState.errors && deleteState.message && (
                <p className="text-red-500 py-0 pl-5">{deleteState.message}</p>
              )}
            </div>
          </div>


          {editFormVisible ? (
            <div className="flex w-full justify-end gap-3 mt-1">
              <Button type="submit">{t('actions.saveProfileUser')}</Button>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setEditFormVisible(false);
                }}
              >
                {t('actions.cancel')}
              </Button>
            </div>
          ) : (
            <div className="flex w-full justify-end gap-3 mt-1">
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setEditFormVisible(true);
                }}
              >
                {t('actions.editProfileUser')}
              </Button>
              <Button
                type="button"
                className="bg-red-500 hover:bg-red-400"
                onClick={(e) => {
                  e.preventDefault();
                  setIsDeleteModalOpen(true);
                }}
              >
                {t('actions.deleteProfileUser')}
              </Button>
            </div>
          )}
        </div>
      </form>
      {/* End Update Form */}


      {/* Begin Delete Form */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">{t('titles.delete')}</h2>
            <p className="mb-6">
              {t('actions.deleteProfileUser')} #{profileUser.id}?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                className="bg-gray-500 hover:bg-gray-400"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                {t('actions.cancel')}
              </Button>
              <form action={deleteFormAction}>
                <input type="hidden" name="id" value={profileUser.id} />
                <Button type="submit" className="bg-red-500 hover:bg-red-400">
                  {t('actions.deleteProfileUser')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* End Delete Form */}
    </div>
  );
}