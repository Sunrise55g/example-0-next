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

import { profileUsersService } from '@/services/profile.users.service';
import { DeleteUser, UpdateUser } from './buttons';


export default function UsersTable({
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
    profileUsersService.findMany(searchParams, token)
      .then((res) => {
        setData(res)
        setLoading(false)
      })
  }, [])


  // console.log('data', data)

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No profile data</p>

  const users: any = data
  // console.log('users', users)


  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {users?.data.map((user: any) => (
                  <div
                    key={user.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            {/* {user.image_url ?? (
                              <Image
                                src={user.image_url}
                                className="rounded-full"
                                alt={`${user.name}'s profile picture`}
                                width={28}
                                height={28}
                              />
                            )} */}
                            <p>{user.username}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    {/* <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Pending</p>
                        <p className="font-medium">{user.total_pending}</p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Paid</p>
                        <p className="font-medium">{user.total_paid}</p>
                      </div>
                    </div>
                    <div className="pt-4 text-sm">
                      <p>{user.total_invoices} invoices</p>
                    </div> */}


                    <div className="flex w-full items-center justify-between pt-4">
                      <div className="flex justify-end gap-2">
                        <UpdateUser id={user.id} />
                        <DeleteUser id={user.id} />
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
                      Email
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      First name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Last Name
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Administrator
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Moderator
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Active
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {users.data.map((user: any) => (
                    <tr key={user.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          {user.image_url && (
                            <Image
                              src={user.image_url}
                              className="rounded-full"
                              alt={`${user.name}'s profile picture`}
                              width={28}
                              height={28}
                            />
                          )}
                          <p>{user.username}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {user.firstName}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {user.lastName}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {user.profile_roles?.administrator ? (
                          <CheckIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <XMarkIcon className="h-5 w-5 text-red-500" />
                        )}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {user.profile_roles?.moderator ? (
                          <CheckIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <XMarkIcon className="h-5 w-5 text-red-500" />
                        )}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                        {user.active ? (
                          <span className="text-green-500">Active</span>
                        ) : (
                          <span className="text-red-500">Inactive</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap bg-white py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateUser id={user.id} />
                          <DeleteUser id={user.id} />
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
