import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import CatalogClientPage from './Catalog.client';
import { CarFetchParams, fetchCarFilters, fetchCars } from '@/lib/api';
import { PAGE_SIZE } from '@/constants/pagination';

interface CatalogPageProps {
  searchParams: CarFetchParams;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const fetchParams: CarFetchParams = await searchParams;

  const queryClient = new QueryClient();

  await queryClient.query({
    queryKey: ['filters'],
    queryFn: fetchCarFilters,
  });

  await queryClient.infiniteQuery({
    queryKey: ['cars', fetchParams],
    queryFn: async ({ pageParam = 1 }) => {
      return fetchCars({
        filters: fetchParams,
        page: pageParam,
        perPage: PAGE_SIZE,
      });
    },
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CatalogClientPage initialFetchParams={fetchParams} />
    </HydrationBoundary>
  );
}
