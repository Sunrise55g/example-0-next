'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/buttons';

import TicketsItemsForm from './table-items-form';

import { ticketsInvoicesService } from '@/services/tickets-invoices.service';



export default function TableEditForm({
  ticketsInvoice,
  ticketsCategories,
  partsItems,
  onUpdateSuccess,
}: {
  ticketsInvoice: any;
  ticketsCategories: any;
  partsItems: any;
  onUpdateSuccess: () => void;
}) {

  // params
  const { data: session, status }: any = useSession();
  const token = session?.user?.jwt;
  const t = useTranslations('TicketsInvoices');


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
      ticketsCategoryId: formData.get('ticketsCategoryId'),
      description: formData.get('description'),
      status: formData.get('status')
    };
    // console.log('rawFormData (update):', { id, ...rawFormData });

    if (!id) {
      return {
        errors: { statusCode: 400 },
        message: `Error: Received status 400`,
        success: false,
      };
    }

    const serviceResponse: any = await ticketsInvoicesService.updateOneCurrent(+id, rawFormData, token);

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



  return (
    <div className="w-full rounded-md bg-gray-200 text-sm p-4 mb-5 mt-5">

      {/* Begin Update Form */}
      <form action={updateFormAction}>

        <h2 className="flex justify-between items-center text-lg font-semibold text-gray-700 mb-3">
          <span>{t('labels.ticketsInvoice')} #{ticketsInvoice.id}</span>
          <span className="text-sm font-normal">
            {t('labels.createdAt')}: {new Date(ticketsInvoice.createdAt).toLocaleString()} |{' '}
            {t('labels.updatedAt')}: {new Date(ticketsInvoice.updatedAt).toLocaleString()}
          </span>
        </h2>

        <input type="hidden" name="id" value={ticketsInvoice.id} />


        <div className="flex flex-col md:flex-row w-full items-start justify-between gap-4 mt-2 mb-2">
          <div className="w-full md:flex-1">
            <label htmlFor="name" className="text-xs text-gray-500 block mb-1">
              {t('labels.name')}:
            </label>
            <input
              id="name"
              name="name"
              type="string"
              defaultValue={ticketsInvoice.name}
              placeholder={t('placeholders.name')}
              className={`w-full h-9 text-sm rounded-md border py-0 pl-5 
                ${editFormVisible ? 'border-green-500 outline-2' : 'border-gray-200'}`}
              disabled={!editFormVisible}
              aria-describedby="update-error"
            />
          </div>

          <div className="w-full md:flex-1">
            <label htmlFor="ticketsCategoryId" className="text-xs text-gray-500 block mb-1">
              {t('labels.ticketsCategory')}:
            </label>
            <select
              id="ticketsCategoryId"
              name="ticketsCategoryId"
              className={`w-full h-9 text-sm rounded-md border py-0 pl-5 
                ${editFormVisible ? 'border-green-500 outline-2 cursor-pointer' : 'border-gray-200 bg-none'}`}
              defaultValue={
                (() => {
                  return ticketsInvoice.ticketsCategoryId
                })()
              }
              key={ticketsInvoice.ticketsCategoryId}
              disabled={!editFormVisible}
              aria-describedby="update-error"
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
              className={`w-full h-9 text-sm rounded-md border py-0 pl-5
                ${editFormVisible ? 'border-green-500 outline-2 cursor-pointer' : 'border-gray-200 bg-none'}`}
              defaultValue={
                (() => {
                  return ticketsInvoice.status
                })()
              }
              key={ticketsInvoice.status}
              disabled={!editFormVisible}
              aria-describedby="update-error"
            >
              <option key="OPEN" value="OPEN" className="text-blue-500">
                {t('labels.statusChoices.open')}
              </option>
              <option key="CLOSED" value="CLOSED" className="text-green-500">
                {t('labels.statusChoices.closed')}
              </option>
              <option key="CANCELED" value="CANCELED" className="text-red-500">
                {t('labels.statusChoices.canceled')}
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
            defaultValue={ticketsInvoice.description || ''}
            placeholder={t('placeholders.descriptionNone')}
            className={`w-full h-9 text-sm rounded-md border py-0 pl-5
              ${editFormVisible ? 'border-green-500 outline-2' : 'border-gray-200'}`}
            disabled={!editFormVisible}
            aria-describedby="update-error"
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
              className="w-full h-9 text-sm rounded-md border bg-blue-300 py-0 pl-5 border-gray-200 bg-none"
              defaultValue={
                (() => {
                  return ticketsInvoice.customerUserId
                })()
              }
              key={ticketsInvoice.customerUserId}
              disabled
              aria-describedby="update-error"
            >
              <option value="" disabled>
                {t('placeholders.customerUserNone')}
              </option>
              <option key={ticketsInvoice.customerUserId} value={ticketsInvoice.customerUserId}>
                {(() => {

                  if (ticketsInvoice.customerUser) {

                    const profileUser = ticketsInvoice.customerUser;
                    let result = ``

                    result += `${t('labels.customerUser')} #${profileUser.id} `;
                    result += ` --- username: ${profileUser.username}, email: ${profileUser.email} `;

                    if (profileUser.phone) {
                      result += ` --- ${t('labels.phone')}: ${profileUser.phone} `;
                    }
                    if (profileUser.firstName) {
                      result += ` --- ${t('labels.firstName')}: ${profileUser.firstName} `;
                    }
                    if (profileUser.lastName) {
                      result += `${t('labels.lastName')}: ${profileUser.lastName} `;
                    }

                    return result;
                  }
                })()}
              </option>
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
              className="w-full h-9 text-sm rounded-md border bg-red-300 py-0 pl-5 border-gray-200 bg-none"
              defaultValue={ticketsInvoice.employerUserId || ''}
              key={ticketsInvoice.employerUserId}
              disabled={!editFormVisible}
              aria-describedby="update-error"
            >
              <option value="" disabled>
                {t('placeholders.employerUserNone')}
              </option>
              <option key={ticketsInvoice.employerUserId} value={ticketsInvoice.employerUserId}>
                {(() => {

                  if (ticketsInvoice.employerUser) {

                    const profileUser = ticketsInvoice.employerUser;
                    let result = ``

                    result += `${t('labels.employerUser')} #${profileUser.id} `;
                    result += ` --- username: ${profileUser.username}, email: ${profileUser.email} `;

                    if (profileUser.phone) {
                      result += ` --- ${t('labels.phone')}: ${profileUser.phone} `;
                    }
                    if (profileUser.firstName) {
                      result += ` --- ${t('labels.firstName')}: ${profileUser.firstName} `;
                    }
                    if (profileUser.lastName) {
                      result += `${t('labels.lastName')}: ${profileUser.lastName} `;
                    }

                    return result;
                  }
                })()}
              </option>
            </select>
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
          </div>

          {editFormVisible ? (
            <div className="flex w-full justify-end gap-3 mt-1">
              <Button type="submit">{t('actions.saveTicketsInvoice')}</Button>
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
                {t('actions.editTicketsInvoice')}
              </Button>
            </div>
          )}
        </div>
      </form>
      {/* End Update Form */}


      {/* TicketsItems Form */}
      <TicketsItemsForm
        ticketsInvoice={ticketsInvoice}
        partsItems={partsItems}
        onUpdateSuccess={onUpdateSuccess}
      />


    </div>
  );
}