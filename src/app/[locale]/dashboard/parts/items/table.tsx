'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

import { lusitana } from '@/components/fonts';
import Search from '@/components/search';
import { UpdateButton, DeleteButton } from '@/components/buttons';

import { partsItemsService } from '@/services/parts-items.service';



export default function ItemsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {

  //
  const { data: session, status }: any = useSession();
  const token = session?.user?.jwt

  //
  const locale = useLocale();
  const t = useTranslations('PartsItems');

  //
  let searchParams = `page=${currentPage}`
  if (query) {
    searchParams = `page=${currentPage}&s=${query}`
  }
  // console.log('UsersTable: searchParams:', searchParams)


  //
  const [data, setData]: any = useState(null)
  const [isLoading, setLoading] = useState(true)


  useEffect(() => {
    partsItemsService.findMany(searchParams, token)
      .then((res) => {
        setData(res)
        setLoading(false)
      })
  }, [])


  if (isLoading) return <p>{t('loading')}</p>
  if (!data) return <p>{t('noData')}</p>


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
                        <UpdateButton href={`/dashboard/parts/items/${item.id}/edit`} />
                        <DeleteButton href={`/dashboard/parts/items/${item.id}/delete`} />
                      </div>
                    </div>

                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      {t('fields.name')}
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      {t('fields.description')}
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      {t('fields.categoryId')}
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      {t('fields.category')}
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      {t('fields.active')}
                    </th>
                    {/* <th scope="col" className="px-4 py-5 font-medium">
                      {t('fields.actions')}
                    </th> */}
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
                        {item.partsCategory?.name}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                        {item.active ? (
                          <span className="text-green-500">{t('fields.active')}</span>
                        ) : (
                          <span className="text-red-500">{t('fields.inactive')}</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap bg-white py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateButton href={`/dashboard/parts/items/${item.id}/edit`} />
                          <DeleteButton href={`/dashboard/parts/items/${item.id}/delete`} />
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
