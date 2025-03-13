'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useActionState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { CheckIcon, XMarkIcon, ClockIcon, TrashIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';

import { lusitana } from '@/components/fonts';
import Search from '@/components/search';
import { UpdateButton, DeleteButton, Button } from '@/components/buttons';

import { profileUsersService } from '@/services/profile-users.service';
import { partsItemsService } from '@/services/parts-items.service';

import { ticketsCategoriesService } from '@/services/tickets-categories.service';
import { ticketsInvoicesService } from '@/services/tickets-invoices.service';
import Link from 'next/link';
import { redirect } from 'next/navigation';



export default function ItemsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {

  //// params
  const { data: session, status }: any = useSession();
  const token = session?.user?.jwt

  const locale = useLocale();
  const t = useTranslations('TicketsInvoices');

  let searchParams = `page=${currentPage}`
  if (query) {
    searchParams = `page=${currentPage}&s=${query}`
  }
  // console.log('UsersTable: searchParams:', searchParams)


  //// start get data

  // get profileUsers
  const [profileUsers, setProfileUsers]: any = useState(null)

  useEffect(() => {
    profileUsersService.findMany(undefined, token)
      .then((res) => {
        setProfileUsers(res)
      })
  }, [])
  // console.log('ItemsTable: profileUsers', profileUsers)


  // get ticketsCategories
  const [ticketsCategories, setTicketsCategories]: any = useState(null)

  useEffect(() => {
    ticketsCategoriesService.findMany(undefined, token)
      .then((res) => {
        setTicketsCategories(res)
      })
  }, [])
  // console.log('ItemsTable: ticketsCategories', ticketsCategories)


  // get partsItems
  const [partsItems, setPartsItems]: any = useState(null)

  useEffect(() => {
    partsItemsService.findMany(undefined, token)
      .then((res) => {
        setPartsItems(res)
      })
  }, [])
  // console.log('ItemsTable: partsItems', partsItems)


  // get ticketsInvoices
  const [ticketsInvoices, setTicketsInvoices]: any = useState(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    ticketsInvoicesService.findMany(searchParams, token)
      .then((res) => {
        setTicketsInvoices(res)
        setLoading(false)
      })
  }, [])
  // console.log('ItemsTable: ticketsInvoices', ticketsInvoices)


  //// end get data



  //// Begin Create Action
  type ICreateState = {
    errors?: {};
    message?: string;
  };


  const createInitialState = { message: '', errors: {} };
  const [createState, createFormAction]: any = useActionState(createAction, createInitialState);


  async function createAction(prevState: ICreateState, formData: FormData) {

    const rawFormData = {
      ticketsCategoryId: formData.get('ticketsCategoryId'),
      customerUserId: formData.get('customerUserId'),
      employerUserId: formData.get('employerUserId'),
      name: formData.get('name'),
      description: formData.get('description'),
      status: formData.get('status'),
    }
    console.log('rawFormData:', { rawFormData })

    // const serviceResponse: any = await ticketsInvoicesService.createOne(rawFormData, token)

    // if (serviceResponse.error || serviceResponse.message) {
    //   const message = serviceResponse.message;
    //   const statusCode = serviceResponse.statusCode;
    //   return {
    //     errors: { statusCode: message },
    //     message: `Error: Received status ${statusCode}`,
    //   };
    // }

    // redirect('/dashboard/tickets/invoices');

    setCreateFormVisible(false);

    return {
      errors: { statusCode: 201 },
      message: `Success`,
    };
  }

  //
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);

  //// End Create Action


  ////
  if (isLoading) return <p>{t('loading')}</p>
  if (!ticketsInvoices) return <p>{t('noData')}</p>



  return (
    <div className="w-full mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">


        {/* Start Invoice Create Form */}
        <div className="w-full rounded-md bg-gray-200 mb-5">
          <button
            onClick={() => setCreateFormVisible(!isCreateFormVisible)}
            className="flex w-full h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400"
          >
            {isCreateFormVisible ? "Cancel" : "Create Invoice +"}
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isCreateFormVisible ? 'max-h-[1000px] opacity-100 p-4' : 'max-h-0 opacity-0'
              }`}
          >
            <form id="ticketsInvoiceCreateForm" action={createFormAction}>
              <div className="flex w-full items-start justify-between mb-4 gap-4">
                <div className="flex-1">
                  <label htmlFor="name" className="text-sm text-gray-500 block mb-1">
                    {t('labels.name')}:
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="string"
                    defaultValue=""
                    placeholder={t('placeholders.name')}
                    className="w-full rounded-md border border-gray-200 py-2 pl-5 outline-2"
                  />
                </div>

                <div className="flex-1">
                  <label htmlFor="categoryId" className="text-sm text-gray-500 block mb-1">
                    {t('labels.category')}:
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    className="w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-5 outline-2"
                    defaultValue="Category 1"
                    aria-describedby="invoice-error"
                  >
                    <option value="Category 1">Category 1</option>
                    <option value="Category 2">Category 2</option>
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
                  defaultValue=""
                  placeholder={t('placeholders.description')}
                  className="w-full rounded-md border border-gray-200 py-2 pl-5 text-sm outline-2"
                />
              </div>

              <div className="w-full mb-4">
                <label htmlFor="customerId" className="text-sm text-gray-500 block mb-1">
                  {t('labels.customer')}:
                </label>
                <select
                  id="customerId"
                  name="customerId"
                  className="w-full cursor-pointer rounded-md border bg-blue-300 border-gray-200 py-2 pl-5 outline-2"
                  defaultValue="Customer 1"
                  aria-describedby="invoice-error"
                >
                  <option value="Customer 1">Customer 1</option>
                  <option value="Customer 2">Customer 2</option>
                </select>
              </div>

              <div className="w-full mb-4">
                <label htmlFor="employerId" className="text-sm text-gray-500 block mb-1">
                  {t('labels.employer')}:
                </label>
                <select
                  id="employerId"
                  name="employerId"
                  className="w-full cursor-pointer rounded-md border bg-red-300 border-gray-200 py-2 pl-5 outline-2"
                  defaultValue="Employer 1"
                  aria-describedby="invoice-error"
                >
                  <option value="Employer 1">Employer 1</option>
                  <option value="Employer 2">Employer 2</option>
                </select>
              </div>


              <div className="flex w-full items-start justify-between mb-4 gap-4">
                <div className="flex-1">
                  <label htmlFor="statusId" className="text-sm text-gray-500 block mb-1">
                    {t('labels.status')}:
                  </label>
                  <select
                    id="statusId"
                    name="statusId"
                    className="w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-5 outline-2"
                    defaultValue="Status 1"
                    aria-describedby="invoice-error"
                  >
                    <option value="Status 1">Status 1</option>
                    <option value="Status 2">Status 2</option>
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
                    defaultValue=""
                    placeholder="{t('placeholders.createdAt')}"
                    className="w-full rounded-md border border-gray-200 py-2 pl-5 text-sm outline-2"
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
                    defaultValue=""
                    placeholder="{t('placeholders.updatedAt')}"
                    className="w-full rounded-md border border-gray-200 py-2 pl-5 text-sm outline-2"
                  />
                </div>

              </div>


              <div className="flex w-full justify-end gap-4">
                <Button onClick={() => setCreateFormVisible(!isCreateFormVisible)}>
                  {t('actions.cancel')}
                </Button>
                <Button type="submit">{t('actions.create')}</Button>
              </div>


              <div id="invoice-error" aria-live="polite" aria-atomic="true">
                {createState.errors && createState.message &&
                  <p className="mt-2 text-sm text-red-500">
                    {createState.message}
                  </p>
                }
              </div>


            </form>
          </div>
        </div>
        {/* End Invoice Create Form */}






        {ticketsInvoices?.data.map((invoice: any) => (

          // Start Card
          <div
            key={invoice.id}
            className="mb-4 w-full rounded-md bg-gray-200 p-4"
          >

            {/* Start Invoice Update Form */}
            <form id="ticketsInvoiceUpdateForm" action="">

              <div className="flex w-full items-center justify-between mb-4">

                <div className="flex justify-end gap-5">
                  <div className="flex items-center gap-3">
                    <p>InvoiceName</p>
                  </div>
                  <div className="w-full flex items-center gap-3">
                    <input
                      id="name"
                      name="name"
                      type="string"
                      defaultValue={invoice.name}
                      placeholder={t('placeholders.name')}
                      className="rounded-md border border-gray-200 py-2 pl-10 outline-2"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-5">
                  <div className="flex items-center gap-3">
                    <p>Invoice Category</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      id="categoryId"
                      name="categoryId"
                      className="cursor-pointer rounded-md border border-gray-200 py-2 pl-10 outline-2"
                      defaultValue="Category 1"
                      aria-describedby="invoice-error"
                    >
                      <option value="Category 1">
                        Category 1
                      </option>
                      <option value="Category 2">
                        Category 2
                      </option>
                    </select>
                  </div>
                </div>

              </div>


              <div className="w-full text-sm text-gray-500 mt-4 mb-4">
                <div>Invoice Description</div>
                <input
                  id="description"
                  name="description"
                  type="string"
                  defaultValue={invoice.description}
                  placeholder={t('placeholders.description')}
                  className="w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 "
                />
              </div>


              <div className="w-full rounded-md flex items-center justify-between bg-blue-300 p-3 mt-4 mb-4">
                <div className="w-full flex items-center gap-5">
                  <div className="flex items-center gap-3">
                    <p>Customer</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      id="customerId"
                      name="customerId"
                      className="cursor-pointer rounded-md border border-gray-200 py-2 pl-10 outline-2"
                      defaultValue="Customer 1"
                      aria-describedby="invoice-error"
                    >
                      <option value="Customer 1">
                        Customer 1
                      </option>
                      <option value="Customer 2">
                        Customer 2
                      </option>
                    </select>
                  </div>
                </div>
              </div>


              <div className="w-full rounded-md flex items-center justify-between bg-red-300 p-3 mt-4 mb-4">
                <div className="w-full flex items-center gap-5">
                  <div className="flex items-center gap-3">
                    <p>Employer</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      id="employerId"
                      name="employerId"
                      className="cursor-pointer rounded-md border border-gray-200 py-2 pl-10 outline-2"
                      defaultValue="Employer 1"
                      aria-describedby="invoice-error"
                    >
                      <option value="Employer 1">
                        Employer 1
                      </option>
                      <option value="Employer 2">
                        Employer 2
                      </option>
                    </select>
                  </div>
                </div>
              </div>


              <div className="flex w-full text-sm text-gray-500 items-center gap-2 mt-4 mb-4">
                <p>Created At</p>
                <p>Updated At</p>
              </div>


              <div className="flex w-full items-center justify-between mt-4 mb-4">
                <div className="w-full flex items-center gap-5">
                  <div className="flex items-center gap-3">
                    <p>Status</p>
                  </div>
                  <select
                    id="statusId"
                    name="statusId"
                    className="cursor-pointer rounded-md border border-gray-200 py-2 pl-10 outline-2"
                    defaultValue="Status 1"
                    aria-describedby="invoice-error"
                  >
                    <option value="Status 1">
                      Status 1
                    </option>
                    <option value="Status 2">
                      Status 2
                    </option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <div className="flex justify-end gap-2">
                    <button>Edit button</button>
                    <button>Delete button</button>
                  </div>
                </div>
              </div>

            </form>
            {/* Start Invoice Create Form */}



            <div className="w-full flex items-center row rounded-md mt-10 mb-4 bg-gray-400 p-3">
              <div className="col-6 w-full">
                <p>Items</p>
              </div>
              <div className="col-6 w-full">
                <p>New Item +</p>
              </div>
            </div>


            {/* Tickets Item Create Form */}
            <form className='mb-7' action="">
              <div className="w-full rounded-md mt-3 mb-4 bg-gray-400 p-3">
                <p>Tickets Item Create Form</p>
              </div>
            </form>


            {/* Tickets Items */}
            <div className="w-full rounded-md mt-3 mb-4 bg-gray-400 p-3">
              <p>Tickets Item</p>
            </div>

            <div className="w-full rounded-md mt-3 mb-4 bg-gray-400 p-3">
              <p>Tickets Item</p>
            </div>

            <div className="w-full rounded-md mt-3 mb-4 bg-gray-400 p-3">
              <p>Tickets Item</p>
            </div>


          </div>
          //// End Card



        ))}

      </div>
    </div>
  );
}
