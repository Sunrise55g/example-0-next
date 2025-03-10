'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react'
import { CheckIcon, XMarkIcon, ClockIcon, TrashIcon } from '@heroicons/react/24/solid';

import Image from 'next/image';
import { lusitana } from '@/components/fonts';
import Search from '@/components/search';
import {
  UsersTableType,
  FormattedUsersTable,
} from '@/types/definitions';

import { ticketsInvoicesService } from '@/services/tickets.invoices.service';
import { UpdateButton, DeleteButton } from '@/components/buttons';


export default function ItemsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {

  const { data: session, status }: any = useSession();
  console.log('session:', session)
  const token = session?.user?.jwt

  const [data, setData]: any = useState(null)
  const [isLoading, setLoading] = useState(true)


  let searchParams = `page=${currentPage}`
  if (query) {
    searchParams = `page=${currentPage}&s=${query}`
  }

  console.log('UsersTable: searchParams:', searchParams)


  useEffect(() => {
    ticketsInvoicesService.findMany(searchParams, token)
      .then((res) => {
        setData(res)
        setLoading(false)
      })
  }, [])


  // console.log('data', data)

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No profile data</p>

  const invoices: any = data
  // console.log('invoices', invoices)


  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md p-2 md:pt-0">
              <div className="">
                {invoices?.data.map((invoice: any) => (
                  <div
                    key={invoice.id}
                    className="mb-4 w-full rounded-md bg-gray-100 p-4"
                  >

                    {/* Top */}
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className='w-full'>
                        <div className="mb-2 w-full flex items-center row">
                          <div className="col-6 w-full">
                            <div className="flex items-center gap-3">
                              <p>{invoice.name}</p>
                              <p>- Category: {invoice.ticketsCategory?.name}</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {invoice.description}
                        </p>
                      </div>
                    </div>


                    {/* middle */}
                    <div className="mt-3 mb-4 border-b">
                      {invoice.partsItems.length !== 0 ?
                        (
                          <div>
                            <p>Items:</p>
                            <table className="min-w-full rounded-md text-gray-900 border-collapse mb-4">
                              <thead className="rounded-md text-left text-sm font-normal">
                                <tr>
                                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6 border-b border-r border-gray-200">
                                    Name
                                  </th>
                                  <th scope="col" className="px-3 py-5 font-medium border-b border-r border-gray-200">
                                    Category Id
                                  </th>
                                  <th scope="col" className="px-3 py-5 font-medium border-b border-l border-gray-200">
                                    Category Name
                                  </th>
                                </tr>
                              </thead>

                              <tbody className="divide-y text-gray-900">
                                {invoice.partsItems.map((item: any) => (
                                  <tr key={item.id} className="group">
                                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6 border-t border-r border-gray-200">
                                      <div className="flex items-center gap-3">
                                        <p>{item.name}</p>
                                      </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-5 text-sm border-t border-r border-gray-200">
                                      {item.partsCategoryId}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-5 text-sm border-t border-l border-gray-200">
                                      {item.partsCategory?.name}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div>
                            <p className='mb-4'>No items</p>
                          </div>
                        )
                      }
                    </div>


                    {/* bottom */}
                    <div className="flex items-center justify-between mt-2">
                      <div className='w-full'>
                        <div className="mb-2 w-full flex items-center">
                          <div className="flex items-center gap-3">
                            {invoice.customerUserId ? (
                              <div className="flex items-center gap-3 text-blue-500">
                                <p>Customer:</p>
                                <p>{invoice.customerUser?.username}</p>
                                <p>{invoice.customerUser?.email}</p>
                                <p>{invoice.customerUser?.phone}</p>
                                <p>{invoice.customerUser?.firstName}</p>
                                <p>{invoice.customerUser?.lastName}</p>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3 text-red-500">
                                <p>Customer is not set</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="w-full flex items-center">
                          {invoice.employerUserId ? (
                            <div className="flex items-center gap-3 text-green-500">
                              <p>Employer:</p>
                              <p>{invoice.employerUser?.username}</p>
                              <p>{invoice.employerUser?.email}</p>
                              <p>{invoice.employerUser?.phone}</p>
                              <p>{invoice.employerUser?.firstName}</p>
                              <p>{invoice.employerUser?.lastName}</p>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 text-red-500">
                              <p>Employer is not set</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full items-center justify-between">
                      <div className="flex justify-end gap-2">

                        {invoice.status === 'OPEN' &&
                          <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-500">
                            Open
                            <ClockIcon className="ml-1 w-4 text-gray-500" />
                          </span>
                        }
                        {invoice.status === 'CLOSED' &&
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs bg-green-500 text-white">
                            CLOSED
                            <CheckIcon className="ml-1 w-4 text-white" />
                          </span>
                        }
                        {invoice.status === 'CANCELED' &&
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs bg-red-500 text-white">
                            CANCELED
                            <TrashIcon className="ml-1 w-4 text-gray-500" />
                          </span>
                        }

                        <div className='inline-flex gap-2 text-gray-500'>
                          <p>Created at:  {new Date(invoice.createdAt).toLocaleString()}</p>
                          <p>Updated at:  {new Date(invoice.updatedAt).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <div className="flex justify-end gap-2">
                          <UpdateButton href={`/dashboard/tickets/invoices/${invoice.id}/edit`} />
                          <DeleteButton href={`/dashboard/tickets/invoices/${invoice.id}/delete`} />
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
