'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/buttons';

import { ticketsCategoriesService } from '@/services/tickets-categories.service';




export default function TableEditForm({
  ticketsCategory,
  onUpdateSuccess,
}: {
  ticketsCategory: any;
  onUpdateSuccess: () => void;
}) {

  // params
  const { data: session }: any = useSession();
  const token = session?.user?.jwt;
  const administrator = session?.user?.profileRole?.administrator || false;
  const moderator = session?.user?.profileRole?.moderator || false;
  const t = useTranslations('TicketsCategories');


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
    const id = formData.get('id');
    const rawFormData = {
      name: formData.get('name'),
      description: formData.get('description'),
      active: formData.get('active') === 'on',
    };
    // console.log('rawFormData (update):', { id, ...rawFormData });

    if (!id) {
      return {
        errors: { statusCode: 400 },
        message: `Error: Received status 400`,
        success: false,
      };
    }

    const serviceResponse: any = await ticketsCategoriesService.updateOne(+id, rawFormData, token);

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

    const serviceResponse: any = await ticketsCategoriesService.deleteOne(+id, token);

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
          <span>{t('labels.ticketsCategory')} #{ticketsCategory.id}</span>
          <span className="text-sm font-normal">
            {t('labels.createdAt')}: {new Date(ticketsCategory.createdAt).toLocaleString()} |{' '}
            {t('labels.updatedAt')}: {new Date(ticketsCategory.updatedAt).toLocaleString()}
          </span>
        </h2>

        <input type="hidden" name="id" value={ticketsCategory.id} />


        <div className="flex w-full items-start gap-5 mt-0 mb-2">

          <div className="flex-1">
            <label htmlFor="name" className="text-xs text-gray-500 block mb-1">
              {t('labels.name')}:
            </label>
            <input
              id="name"
              name="name"
              type="string"
              defaultValue={ticketsCategory.name}
              placeholder={t('placeholders.name')}
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
              defaultChecked={ticketsCategory.active}
              aria-describedby="update-error"
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
            defaultValue={ticketsCategory.description}
            placeholder={t('placeholders.description')}
            className={
              `w-full h-9 text-sm rounded-md border py-0 pl-5 
              ${editFormVisible ? 'border-green-500 outline-2' : 'border-gray-200'}`
            }
            disabled={!editFormVisible}
            aria-describedby="update-error"
          />
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
            <div id="delete-invoice-error" aria-live="polite" aria-atomic="true">
              {deleteState.errors && deleteState.message && (
                <p className="text-red-500 py-0 pl-5">{deleteState.message}</p>
              )}
            </div>
          </div>


          {(administrator || moderator) && (

            editFormVisible ? (
              <div className="flex w-full justify-end gap-3 mt-1">
                <Button type="submit">{t('actions.saveTicketsCategory')}</Button>
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
                  {t('actions.editTicketsCategory')}
                </Button>
                <Button
                  type="button"
                  className="bg-red-500 hover:bg-red-400"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsDeleteModalOpen(true);
                  }}
                >
                  {t('actions.deleteTicketsCategory')}
                </Button>
              </div>
            )

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
              {t('actions.deleteTicketsCategory')} #{ticketsCategory.id}?
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
                <input type="hidden" name="id" value={ticketsCategory.id} />
                <Button type="submit" className="bg-red-500 hover:bg-red-400">
                  {t('actions.deleteTicketsCategory')}
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