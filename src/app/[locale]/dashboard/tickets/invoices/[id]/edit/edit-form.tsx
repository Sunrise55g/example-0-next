'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useActionState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { redirect } from 'next/navigation';

import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

import { Button } from '@/components/buttons';

import { ticketsInvoicesService } from '@/services/tickets-invoices.service';



export default function EditForm({
  categories,
  users,
  invoice
}: {
  categories: any;
  users: any;
  invoice: any;
}) {

  //
  const { data: session, status }: any = useSession();
  const token = session?.user?.jwt

  //
  const locale = useLocale();
  const t = useTranslations('TicketsInvoices');


  //
  type IState = {
    errors?: {};
    message?: string;
  };


  const initialState = { message: '', errors: {} };
  const [state, formAction]: any = useActionState(action, initialState);


  async function action(prevState: IState, formData: FormData) {

    const rawFormData = {
      ticketsCategoryId: formData.get('ticketsCategoryId'),
      customerUserId: formData.get('customerUserId'),
      employerUserId: formData.get('employerUserId'),
      name: formData.get('name'),
      description: formData.get('description'),
      status: formData.get('status'),
    }
    // console.log('rawFormData:', { rawFormData })

    const serviceResponse: any = await ticketsInvoicesService.updateOne(+invoice.id, rawFormData, token);

    if (serviceResponse.error || serviceResponse.message) {
      const message = serviceResponse.message;
      const statusCode = serviceResponse.statusCode;
      return {
        errors: { statusCode: message },
        message: `Error: Received status ${statusCode}`,
      };
    }

    redirect('/dashboard/tickets/invoices');
  }



  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Categories */}
        <div className="mb-4">
          <label htmlFor="ticketsCategoryId" className="mb-2 block text-sm font-medium">
            {t('labels.category')}
          </label>
          <div className="relative">
            <select
              id="ticketsCategoryId"
              name="ticketsCategoryId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={invoice.categoryId}
              aria-describedby="invoice-error"
            >
              <option value="" disabled>
                <p className="text-gray-500">{t('placeholders.category')}</p>
              </option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="invoice-error" aria-live="polite" aria-atomic="true">
            {state.errors?.categoryId &&
              state.errors.categoryId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>


        {/* Customer */}
        <div className="mb-4">
          <label htmlFor="customerUserId" className="mb-2 block text-sm font-medium">
            {t('labels.customer')}
          </label>
          <div className="relative">
            <select
              id="customerUserId"
              name="customerUserId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={invoice.customerUserId || ""}
              aria-describedby="invoice-error"
            >
              <option value="" disabled>
                <p className="text-gray-500">{t('placeholders.customer')}</p>
              </option>
              {users.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="invoice-error" aria-live="polite" aria-atomic="true">
            {state.errors?.customerUserId &&
              state.errors.customerUserId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>


        {/* Employer */}
        <div className="mb-4">
          <label htmlFor="employerUserId" className="mb-2 block text-sm font-medium">
            {t('labels.employer')}
          </label>
          <div className="relative">
            <select
              id="employerUserId"
              name="employerUserId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={invoice.employerUserId || ""}
              aria-describedby="invoice-error"
            >
              <option value="" disabled>
                <p className="text-gray-500">{t('placeholders.employer')}</p>
              </option>
              {users.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="invoice-error" aria-live="polite" aria-atomic="true">
            {state.errors?.employerUserId &&
              state.errors.employerUserId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>


        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            {t('labels.name')}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="string"
                defaultValue={invoice.name}
                placeholder={t('placeholders.name')}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="invoice-error" aria-live="polite" aria-atomic="true">
              {state?.errors?.name &&
                state?.errors?.name.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>


        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            {t('labels.description')}
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="description"
                name="description"
                type="string"
                defaultValue={invoice.description}
                placeholder={t('placeholders.description')}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="invoice-error" aria-live="polite" aria-atomic="true">
              {state.errors?.description &&
                state.errors.description.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>


        {/* Status */}
        <div className="mb-4">
          <label htmlFor="status" className="mb-2 block text-sm font-medium">
            {t('labels.status')}
          </label>
          <div className="relative">
            <select
              id="status"
              name="status"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={invoice.status}
              aria-describedby="invoice-error"
            >
              <option value="OPEN">
                <p className="bg-gray-100 text-gray-500">{t('fields.statusChoices.open')}</p>
              </option>
              <option value="CLOSED">
                <p className="bg-green-500 text-white">{t('fields.statusChoices.closed')}</p>
              </option>
              <option value="CANCELED">
                <p className="bg-red-500 text-white">{t('fields.statusChoices.canceled')}</p>
              </option>
            </select>
            <CheckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="invoice-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>


        <div id="invoice-error" aria-live="polite" aria-atomic="true">
          {state.errors && state.message &&
            <p className="mt-2 text-sm text-red-500">
              {state.message}
            </p>
          }
        </div>

      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/tickets/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          {t('actions.cancel')}
        </Link>
        <Button type="submit">{t('actions.update')}</Button>
      </div>

    </form>
  );
}
