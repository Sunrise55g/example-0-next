'use client';

import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

import { useActionState } from 'react';

import { Button } from '@/components/buttons';
import { profileRolesService } from '@/services/profile.roles.service';

import { useSession } from 'next-auth/react';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';




export default function DeleteForm({
  role
}: {
  role: any;
}) {

  //
  const { data: session, status }: any = useSession();
  const token = session?.user?.jwt

  //
  type IState = {
    errors?: {};
    message?: string;
  };

  const initialState = { message: '', errors: {} };
  const [state, formAction]: any = useActionState(action, initialState);

  async function action(prevState: IState, formData: FormData) {


    const serviceResponse: any = await profileRolesService.deleteOne(+role.id, token);

    if (serviceResponse.error || serviceResponse.message) {
      const message = serviceResponse.message;
      const statusCode = serviceResponse.statusCode;
      return {
        errors: { statusCode: message },
        message: `Error: Received status ${statusCode}`,
      };
    }

    redirect('/dashboard/profile/roles');
  }



  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="string"
                placeholder="Enter name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={role.name}
                disabled
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="role-error" aria-live="polite" aria-atomic="true">
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
            Description
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="description"
                name="description"
                type="string"
                placeholder="Enter Description"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={role.description}
                disabled
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="role-error" aria-live="polite" aria-atomic="true">
              {state.errors?.description &&
                state.errors.description.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>


        {/* administrator */}
        <div className="mb-4">
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="administrator"
                name="administrator"
                type="checkbox"
                className="peer h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                defaultChecked={role.administrator}
                disabled
              />
              <label htmlFor="administrator" className="ml-2 text-sm text-gray-900">
                This is Administrator
              </label>
            </div>
            <div id="role-error" aria-live="polite" aria-atomic="true">
              {state.errors?.administrator &&
                state.errors.administrator.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>


        {/* moderator */}
        <div className="mb-4">
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="moderator"
                name="moderator"
                type="checkbox"
                className="peer h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                defaultChecked={role.moderator}
                disabled
              />
              <label htmlFor="moderator" className="ml-2 text-sm text-gray-900">
                This is Moderator
              </label>
            </div>
            <div id="role-error" aria-live="polite" aria-atomic="true">
              {state.errors?.moderator &&
                state.errors.moderator.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>


        {/* active */}
        <div className="mb-4">
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="active"
                name="active"
                type="checkbox"
                className="peer h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                defaultChecked={role.active}
                disabled
              />
              <label htmlFor="active" className="ml-2 text-sm text-gray-900">
                Role is Active
              </label>
            </div>
            <div id="role-error" aria-live="polite" aria-atomic="true">
              {state.errors?.active &&
                state.errors.active.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>


        <div id="role-error" aria-live="polite" aria-atomic="true">
          {state.errors && state.message &&
            <p className="mt-2 text-sm text-red-500">
              {state.message}
            </p>
          }
        </div>

      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/profile/roles"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Delete Role</Button>
      </div>

    </form>
  );
}
