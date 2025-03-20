'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { useDebouncedCallback } from 'use-debounce';



export default function Sorting({ sortOptions }: { sortOptions: any }) {

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();


  const handleSearch = useDebouncedCallback((term: string) => {

    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    if (term) {
      params.set('sort', term);
    } else {
      params.delete('sort');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 100);



  return (
    <div className="relative flex shrink-0 w-1/4">

      <label htmlFor="sorting" className="sr-only">
        Sorting
      </label>

      <select
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('sort')?.toString()}
      >
        {sortOptions.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ArrowsUpDownIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

    </div>

  );
}