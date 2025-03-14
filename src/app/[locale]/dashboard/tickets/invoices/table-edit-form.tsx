'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/buttons';

import TicketsItemsForm from './table-items-form';

import { ticketsInvoicesService } from '@/services/tickets-invoices.service';
import { ticketsItemsService } from '@/services/tickets-items.service';



export default function TableEditForm({
  ticketsInvoice,
  profileUsers,
  ticketsCategories,
  partsItems,
  onUpdateSuccess,
}: {
  ticketsInvoice: any;
  profileUsers: any;
  ticketsCategories: any;
  partsItems: any;
  onUpdateSuccess: () => void;
}) {

  // params
  const { data: session, status }: any = useSession();
  const token = session?.user?.jwt;

  const t = useTranslations('TicketsInvoices');


  //// Begin Update Action
  const [isEditing, setIsEditing] = useState(false);

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
      ticketsCategoryId: formData.get('ticketsCategoryId'),
      description: formData.get('description'),
      customerUserId: formData.get('customerUserId'),
      employerUserId: formData.get('employerUserId'),
      status: formData.get('status'),
    };
    console.log('rawFormData (update):', { id, ...rawFormData });

    if (!id) {
      return {
        errors: { statusCode: 400 },
        message: `Error: Received status 400`,
        success: false,
      };
    }

    const serviceResponse: any = await ticketsInvoicesService.updateOne(+id, rawFormData, token);

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
      errors: { statusCode: 200 },
      message: `Success`,
      success: true,
    };
  }

  useEffect(() => {
    if (updateState.success) {
      setIsEditing(false);
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
    console.log('deleteAction - id:', id);

    if (!id) {
      return {
        errors: { statusCode: 400 },
        message: `Error: Received status 400 - Invalid ID`,
        success: false,
      };
    }

    const serviceResponse: any = await ticketsInvoicesService.deleteOne(+id, token);

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
    <div className="mb-4 w-full rounded-md bg-gray-200 p-4">

      {/* Update Form */}
      <form action={updateFormAction}>
        <input type="hidden" name="id" value={ticketsInvoice.id} />

        <div className="flex w-full items-start justify-between mb-4 gap-4">
          <div className="flex-1">
            <label htmlFor="name" className="text-sm text-gray-500 block mb-1">
              {t('labels.name')}:
            </label>
            <input
              id="name"
              name="name"
              type="string"
              defaultValue={ticketsInvoice.name}
              placeholder={t('placeholders.name')}
              className={`w-full rounded-md border py-2 pl-5 outline-2 ${isEditing ? 'border-green-500' : 'border-gray-200'
                }`}
              disabled={!isEditing}
              aria-describedby="update-invoice-error"
            />
          </div>

          <div className="flex-1">
            <label htmlFor="ticketsCategoryId" className="text-sm text-gray-500 block mb-1">
              {t('labels.category')}:
            </label>
            <select
              id="ticketsCategoryId"
              name="ticketsCategoryId"
              className={`w-full cursor-pointer rounded-md border py-2 pl-5 outline-2 ${isEditing ? 'border-green-500' : 'border-gray-200'
                }`}
              defaultValue={ticketsInvoice.ticketsCategoryId}
              disabled={!isEditing}
              aria-describedby="update-invoice-error"
            >
              <option value="" disabled>
                {t('placeholders.category')}
              </option>
              {ticketsCategories?.data?.map((ticketsCategory: any) => (
                <option key={ticketsCategory.id} value={ticketsCategory.id}>
                  {ticketsCategory.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full mb-4">
          <label htmlFor="description" className="text-sm text-gray-500 block mb-1">
            {t('labels.description')}:
          </label>
          <input
            id="description"
            name="description"
            type="string"
            defaultValue={ticketsInvoice.description}
            placeholder={t('placeholders.description')}
            className={`w-full rounded-md border py-2 pl-5 text-sm outline-2 ${isEditing ? 'border-green-500' : 'border-gray-200'
              }`}
            disabled={!isEditing}
            aria-describedby="update-invoice-error"
          />
        </div>

        <div className="flex w-full items-start justify-between mb-4 gap-4">
          <div className="flex-1">
            <label htmlFor="customerUserId" className="text-sm text-gray-500 block mb-1">
              {t('labels.customer')}:
            </label>
            <select
              id="customerUserId"
              name="customerUserId"
              className={`w-full cursor-pointer rounded-md border bg-blue-300 py-2 pl-5 outline-2 ${isEditing ? 'border-green-500' : 'border-gray-200'
                }`}
              defaultValue={ticketsInvoice.customerUserId || ''}
              disabled={!isEditing}
              aria-describedby="update-invoice-error"
            >
              <option value="" disabled>
                {t('placeholders.customer')}
              </option>
              {profileUsers?.data?.map((profileUser: any) => (
                <option key={profileUser.id} value={profileUser.id}>
                  {profileUser.username}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="employerUserId" className="text-sm text-gray-500 block mb-1">
              {t('labels.employer')}:
            </label>
            <select
              id="employerUserId"
              name="employerUserId"
              className={`w-full cursor-pointer rounded-md border bg-red-300 py-2 pl-5 outline-2 ${isEditing ? 'border-green-500' : 'border-gray-200'
                }`}
              defaultValue={ticketsInvoice.employerUserId || ''}
              disabled={!isEditing}
              aria-describedby="update-invoice-error"
            >
              <option value="" disabled>
                {t('placeholders.employer')}
              </option>
              {profileUsers?.data?.map((profileUser: any) => (
                <option key={profileUser.id} value={profileUser.id}>
                  {profileUser.username}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex w-full items-start justify-between mb-4 gap-4">
          <div className="flex-1">
            <label htmlFor="status" className="text-sm text-gray-500 block mb-1">
              {t('labels.status')}:
            </label>
            <select
              id="status"
              name="status"
              className={`peer block w-full cursor-pointer rounded-md border py-2 pl-5 text-sm outline-2 placeholder:text-gray-500 ${isEditing ? 'border-green-500' : 'border-gray-200'
                }`}
              defaultValue={ticketsInvoice.status}
              disabled={!isEditing}
              aria-describedby="update-invoice-error"
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

          <div className="flex-1">
            <label htmlFor="createdAt" className="text-sm text-gray-500 block mb-1">
              {t('labels.createdAt')}:
            </label>
            <input
              id="createdAt"
              name="createdAt"
              type="string"
              defaultValue={new Date(ticketsInvoice.createdAt).toLocaleString()}
              placeholder={t('labels.createdAt')}
              className={`w-full rounded-md border py-2 pl-5 text-sm outline-2 ${isEditing ? 'border-green-500' : 'border-gray-200'
                }`}
              disabled
            />
          </div>

          <div className="flex-1">
            <label htmlFor="updatedAt" className="text-sm text-gray-500 block mb-1">
              {t('labels.updatedAt')}:
            </label>
            <input
              id="updatedAt"
              name="updatedAt"
              type="string"
              defaultValue={new Date(ticketsInvoice.updatedAt).toLocaleString()}
              placeholder={t('labels.updatedAt')}
              className={`w-full rounded-md border py-2 pl-5 text-sm outline-2 ${isEditing ? 'border-green-500' : 'border-gray-200'
                }`}
              disabled
            />
          </div>
        </div>

        <div className="flex w-full items-start justify-between gap-4">
          <div className="flex-1">
            <div id="update-invoice-error" aria-live="polite" aria-atomic="true">
              {updateState.errors && updateState.message && (
                <p className="text-red-500 py-2 pl-5">{updateState.message}</p>
              )}
            </div>
            <div id="delete-invoice-error" aria-live="polite" aria-atomic="true">
              {deleteState.errors && deleteState.message && (
                <p className="text-red-500 py-2 pl-5">{deleteState.message}</p>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="flex w-full justify-end gap-3">
              <Button type="submit">{t('actions.save')}</Button>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(false);
                }}
              >
                {t('actions.cancel')}
              </Button>
            </div>
          ) : (
            <div className="flex w-full justify-end gap-3 mt-2">
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(true);
                }}
              >
                {t('actions.edit')}
              </Button>
              <Button
                type="button"
                className="bg-red-500 hover:bg-red-400"
                onClick={(e) => {
                  e.preventDefault();
                  setIsDeleteModalOpen(true);
                }}
              >
                {t('actions.delete')}
              </Button>
            </div>
          )}
        </div>
      </form>



      {/* TicketsItems Form */}
      <TicketsItemsForm
        ticketsInvoice={ticketsInvoice}
        partsItems={partsItems}
        onUpdateSuccess={onUpdateSuccess}
      />



      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">{"t('confirm.deleteTitle')"}</h2>
            <p className="mb-6">{"t('confirm.deleteMessage')"}</p>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                className="bg-gray-500 hover:bg-gray-400"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                {t('actions.cancel')}
              </Button>
              <form action={deleteFormAction}>
                <input type="hidden" name="id" value={ticketsInvoice.id} />
                <Button type="submit" className="bg-red-500 hover:bg-red-400">
                  {"t('actions.confirm')"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}