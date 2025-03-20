'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import TableEditForm from './table-edit-form';
import TableCreateForm from './table-create-form';

import { partsCategoriesService } from '@/services/parts-categories.service';
import { partsItemsService } from '@/services/parts-items.service';



export default function Table({
  query,
  sort,
  currentPage,
}: {
  query: string;
  sort: string;
  currentPage: number;
}) {

  //// params
  const { data: session, status }: any = useSession();
  const token = session?.user?.jwt;

  const locale = useLocale();
  const t = useTranslations('PartsItems');

  const searchParams = useMemo(
    () => ({
      page: currentPage || 1,
      query: query || undefined,
      sort: sort || undefined,
    }),
    [currentPage, query, sort]
  );
  // console.log('Table: searchParams:', searchParams);


  ////
  const [partsCategories, setPartsCategories]: any = useState(null);
  const [partsItems, setPartsItems]: any = useState(null);
  const [isInitialLoading, setInitialLoading] = useState(true);


  const fetchAllData = async () => {
    try {
      const [categoriesRes, itemsRes] = await Promise.all([
        partsCategoriesService.findMany(undefined, token),
        partsItemsService.findMany(searchParams, token),
      ]);
      // console.log('fetchAllData: categoriesRes:', { categoriesRes });
      // console.log('fetchAllData: itemsRes:', { itemsRes });

      setPartsCategories(categoriesRes);
      setPartsItems(itemsRes);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setInitialLoading(false);
    }
  };


  useEffect(() => {
    fetchAllData();
    const intervalId = setInterval(() => {
      fetchAllData();
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);


  useEffect(() => {
    fetchAllData();
  }, [searchParams]);


  ////
  if (isInitialLoading) return <p>{t('messages.loading')}</p>;
  if (!partsItems) return <p>{t('messages.noData')}</p>;


  return (
    <div className="w-full mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <TableCreateForm
          partsCategories={partsCategories}
          onCreateSuccess={fetchAllData}
        />

        {partsItems?.data?.map((partsItem: any) => (
          <TableEditForm
            key={partsItem.id}
            partsCategories={partsCategories}
            partsItem={partsItem}
            onUpdateSuccess={fetchAllData}
          />
        ))}
      </div>
    </div>
  );
}