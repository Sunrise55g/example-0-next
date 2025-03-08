'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

import Image from 'next/image';
import { lusitana } from '@/components/fonts';
import Search from '@/components/search';

import { profileRolesService } from '@/services/profile.roles.service';
import { DeleteRole, UpdateRole } from './buttons';


export default function RolesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {

  const { data: session, status }: any = useSession();
  const token = session?.user?.jwt

  const [data, setData]: any = useState(null)
  const [isLoading, setLoading] = useState(true)


  let searchParams = `page=${currentPage}`
  if (query) {
    searchParams = `page=${currentPage}&s=${query}`
  }

  console.log('RolesTable: searchParams:', searchParams)


  useEffect(() => {
    profileRolesService.findMany(searchParams, token)
      .then((res) => {
        setData(res)
        setLoading(false)
      })
  }, [])


  // console.log('data', data)

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No roles data</p>

  const roles: any = data
  // console.log('roles', roles)


  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {roles?.data.map((role: any) => (
                  <div
                    key={role.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <p>{role.name}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {role.description}
                        </p>
                      </div>
                    </div>


                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Administrator</p>
                        <p className="font-medium">
                          {role.administrator ? (
                            <CheckIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <XMarkIcon className="h-5 w-5 text-red-500" />
                          )}
                        </p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Moderator</p>
                        <p className="font-medium">
                          {role.moderator ? (
                            <CheckIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <XMarkIcon className="h-5 w-5 text-red-500" />
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 text-sm">
                      <p>
                        {role.active ? (
                          <span className="text-green-500">Active</span>
                        ) : (
                          <span className="text-red-500">Inactive</span>
                        )}
                      </p>
                    </div>


                    <div className="flex w-full items-center justify-between pt-4">
                      <div className="flex justify-end gap-2">
                        <UpdateRole id={role.id} />
                        <DeleteRole id={role.id} />
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
                      Administrator
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Moderator
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Active
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Created At
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Updated At
                    </th>
                    {/* <th scope="col" className="px-4 py-5 font-medium">
                      Actions
                    </th> */}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {roles.data.map((role: any) => (
                    <tr key={role.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{role.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {role.description}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {role.administrator ? (
                          <CheckIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <XMarkIcon className="h-5 w-5 text-red-500" />
                        )}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {role.moderator ? (
                          <CheckIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <XMarkIcon className="h-5 w-5 text-red-500" />
                        )}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                        {role.active ? (
                          <span className="text-green-500">Active</span>
                        ) : (
                          <span className="text-red-500">Inactive</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {new Date(role.createdAt).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {new Date(role.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateRole id={role.id} />
                          <DeleteRole id={role.id} />
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
