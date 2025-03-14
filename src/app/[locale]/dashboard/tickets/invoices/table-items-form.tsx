'use client';

import { useState, useEffect, useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/buttons';
import { ticketsItemsService } from '@/services/tickets-items.service';
import { useSession } from 'next-auth/react';

export default function TicketsItemsForm({
  ticketsInvoice,
  partsItems,
  onUpdateSuccess,
}: {
  ticketsInvoice: any;
  partsItems: any;
  onUpdateSuccess: () => void;
}) {
  // params
  const { data: session, status }: any = useSession();
  const token = session?.user?.jwt;

  const t = useTranslations('TicketsInvoices');

  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Для модального окна удаления
  const [itemToDelete, setItemToDelete] = useState<number | null>(null); // ID элемента для удаления

  //// Begin Create TicketsItem Action
  type ICreateState = {
    errors?: {};
    message?: string;
    success?: boolean;
  };

  const createInitialState = { message: '', errors: {}, success: false };
  const [createState, createFormAction]: any = useActionState(createAction, createInitialState);

  async function createAction(prevState: ICreateState, formData: FormData) {
    const rawFormData = {
      ticketsInvoiceId: ticketsInvoice.id,
      partsItemId: formData.get('partsItemId'),
    };
    console.log('rawFormData (create ticketsItem):', rawFormData);

    const serviceResponse: any = await ticketsItemsService.createOne(rawFormData, token);

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
      errors: { statusCode: 201 },
      message: `Success`,
      success: true,
    };
  }

  useEffect(() => {
    if (createState.success) {
      setCreateFormVisible(false);
      onUpdateSuccess();
    }
  }, [createState.success, onUpdateSuccess]);

  //// End Create TicketsItem Action

  //// Begin Delete TicketsItem Action
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

    const serviceResponse: any = await ticketsItemsService.deleteOne(+id, token);

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
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      onUpdateSuccess();
    }
  }, [deleteState.success, onUpdateSuccess]);

  //// End Delete TicketsItem Action

  // Функция для открытия модального окна с ID элемента
  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="w-full rounded-md bg-gray-400 mt-5 mb-5">
      <button
        onClick={() => setCreateFormVisible(!isCreateFormVisible)}
        className="flex w-full h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400"
      >
        {isCreateFormVisible ? t('actions.cancel') : t('actions.createItem')}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isCreateFormVisible ? 'max-h-[1000px] opacity-100 p-4' : 'max-h-0 opacity-0'
        }`}
      >
        <form action={createFormAction}>
          <div className="flex w-full items-start justify-between mb-4 gap-4">
            <div className="flex-1">
              <label htmlFor="partsItemId" className="text-sm text-gray-500 block mb-1">
                {t('labels.item')}:
              </label>
              <select
                id="partsItemId"
                name="partsItemId"
                className="w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-5 outline-2"
                defaultValue=""
                aria-describedby="create-item-error"
                required
              >
                <option value="" disabled>
                  {t('placeholders.item')}
                </option>
                {partsItems?.data?.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex w-full items-start justify-between gap-4">
            <div className="flex-1">
              <div id="create-item-error" aria-live="polite" aria-atomic="true">
                {createState.errors && createState.message && (
                  <p className="text-red-500 py-2 pl-5">{createState.message}</p>
                )}
              </div>
            </div>
            <div className="flex w-full justify-end gap-3">
              <Button type="button" onClick={() => setCreateFormVisible(false)}>
                {t('actions.cancel')}
              </Button>
              <Button type="submit">{t('actions.create')}</Button>
            </div>
          </div>
        </form>
      </div>

      {/* Список ticketsItems с кнопкой удаления */}
      {ticketsInvoice?.ticketsItems.map((ticketsItem: any) => (
        <div
          key={ticketsItem.id}
          className="p-2 border-b border-gray-300 flex justify-between items-center"
        >
          <span>{ticketsItem.partsItem.name}</span>
          <Button
            type="button"
            className="bg-red-500 hover:bg-red-400 text-white px-2 py-1 text-sm"
            onClick={() => handleDeleteClick(ticketsItem.id)}
          >
            {t('actions.delete')}
          </Button>
        </div>
      ))}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">{t('confirm.deleteItemTitle')}</h2>
            <p className="mb-6">{t('confirm.deleteItemMessage')}</p>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                className="bg-gray-500 hover:bg-gray-400"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setItemToDelete(null);
                }}
              >
                {t('actions.cancel')}
              </Button>
              <form action={deleteFormAction}>
                <input type="hidden" name="id" value={itemToDelete || ''} />
                <Button type="submit" className="bg-red-500 hover:bg-red-400">
                  {t('actions.confirm')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}