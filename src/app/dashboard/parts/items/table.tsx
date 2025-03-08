'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

import Image from 'next/image';
import { lusitana } from '@/components/fonts';
import Search from '@/components/search';
import {
  UsersTableType,
  FormattedUsersTable,
} from '@/types/definitions';

import { partsItemsService } from '@/services/parts.items.service';
import { DeleteItem, UpdateItem } from './buttons';


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
    partsItemsService.findMany(searchParams, token)
      .then((res) => {
        setData(res)
        setLoading(false)
      })
  }, [])


  // console.log('data', data)

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No profile data</p>

  const items: any = data
  // console.log('items', items)


  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {items?.data.map((item: any) => (
                  <div
                    key={item.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <p>{item.name}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {item.description}
                        </p>
                      </div>
                    </div>


                    <div className="flex w-full items-center justify-between pt-4">
                      <div className="flex justify-end gap-2">
                        <UpdateItem id={item.id} />
                        <DeleteItem id={item.id} />
                      </div>
                    </div>


                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Description
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Category Id
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Category Name
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Active
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {items.data.map((item: any) => (
                    <tr key={item.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{item.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {item.description}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {item.partsCategoryId}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {item.parts_categories?.name}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                        {item.active ? (
                          <span className="text-green-500">Active</span>
                        ) : (
                          <span className="text-red-500">Inactive</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap bg-white py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateItem id={item.id} />
                          <DeleteItem id={item.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
