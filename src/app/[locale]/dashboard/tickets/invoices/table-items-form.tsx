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
    const rawFormData = {
      ticketsInvoiceId: ticketsInvoice.id,
      partsItemId: formData.get('partsItemId'),
    };

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

    setCreateFormVisible(false);

    return {
      errors: { statusCode: 201 },
      message: `Success`,
      success: true,
    };
  }


  useEffect(() => {
    if (createState.success) {
      onUpdateSuccess();
    }
  }, [createState.success, onUpdateSuccess]);

  //// End Create Action


  //// Begin Delete Action
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

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

    setIsDeleteModalOpen(false);
    setItemToDelete(null);

    return {
      errors: { statusCode: 204 },
      message: `Success`,
      success: true,
    };
  }


  useEffect(() => {
    if (deleteState.success) {

      onUpdateSuccess();
    }
  }, [deleteState.success, onUpdateSuccess]);


  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  //// End Delete Action



  return (
    <div className="w-full flow-root text-sm">
      <div className="inline-block min-w-full align-middle">
        {/* Begin Create Form */}
        <div className="w-full rounded-md bg-gray-300 mt-2 mb-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              setCreateFormVisible(!createFormVisible);
            }}
            className="flex w-full h-9 text-sm items-center justify-center rounded-lg bg-blue-500 text-white transition-colors hover:bg-blue-400"
          >
            {!createFormVisible && `${t('actions.addPartsItem')} +`}
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out 
              ${createFormVisible ? 'max-h-[1000px] opacity-100 p-2' : 'max-h-0 opacity-0'}`}
          >
            <form action={createFormAction}>
              <div className="w-full flex flex-col md:flex-row items-center gap-2 rounded-md mt-1 mb-1">
                <select
                  id="partsItemId"
                  name="partsItemId"
                  className="w-full md:flex-1 h-9 text-sm rounded-md border border-gray-300 bg-gray-400 pl-3 py-0 outline-2 cursor-pointer"
                  defaultValue=""
                  aria-describedby="create-item-error"
                  required
                >
                  <option value="" disabled>
                    {t('placeholders.partsItem')}
                  </option>
                  {partsItems?.data?.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {`${t('fields.partsItem')} #${item.id}: ${item.name} -- ${t('fields.partsCategory')} #${item.partsCategoryId}: ${item.partsCategory.name}`}
                    </option>
                  ))}
                </select>

                <Button
                  type="button"
                  onClick={() => setCreateFormVisible(false)}
                  className="w-full md:w-auto h-9 px-4 mt-2 md:mt-0"
                >
                  {t('actions.cancel')}
                </Button>

                <Button type="submit" className="w-full md:w-auto h-9 px-4 mt-2 md:mt-0">
                  {t('actions.addPartsItem')}
                </Button>
              </div>

              {/* Uncomment if you want to show errors */}
              {/* <div className="w-full mt-1 mb-1">
                <div id="create-item-error" aria-live="polite" aria-atomic="true">
                  {createState.errors && createState.message && (
                    <p className="text-red-500 py-0 pl-5">{createState.message}</p>
                  )}
                </div>
              </div> */}
            </form>
          </div>
        </div>
        {/* End Create Form */}

        {/* Begin Tickets Items List */}
        {ticketsInvoice?.ticketsItems.map((ticketsItem: any) => (
          <div
            key={ticketsItem.id}
            className="w-full flex flex-col md:flex-row items-center gap-2 rounded-md mt-2 mb-2"
          >
            <p className="w-full md:flex-1 h-9 text-sm flex items-center rounded-md bg-gray-400 pl-3">
              {`${t('fields.partsItem')} #${ticketsItem.partsItem.id}: ${ticketsItem?.partsItem.name} -- ${t('fields.partsCategory')} #${ticketsItem.partsItem.partsCategoryId}: ${ticketsItem.partsItem.partsCategory.name}`}
            </p>

            <Button
              type="button"
              className="w-full md:w-auto h-9 text-sm bg-red-500 hover:bg-red-400 text-white px-2 py-0 mt-2 md:mt-0"
              onClick={() => handleDeleteClick(ticketsItem.id)}
            >
              {t('actions.deleteTicketsItem')}
            </Button>
          </div>
        ))}
        {/* End Tickets Items List */}

        {/* Begin Delete Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-semibold mb-4">{t('titles.delete')}</h2>
              <p className="mb-6">
                {t('messages.deleteTicketsItem')} #{itemToDelete}?
              </p>
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
                    {t('actions.deleteTicketsItem')}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
        {/* End Delete Modal */}
      </div>
    </div>
  );
}