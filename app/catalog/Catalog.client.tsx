'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

import css from './CatalogClient.module.css';
import { CarFetchParams, fetchCarFilters, fetchCars } from '@/lib/api';
import { PAGE_SIZE } from '@/constants/pagination';
import { CarsList, Loader, NotFound, Search } from '@/components';
import clsx from 'clsx';

interface CatalogClientPageProps {
  initialFetchParams: CarFetchParams;
}

const defaultFetchParams: CarFetchParams = {
  brand: undefined,
  price: undefined,
  minMileage: undefined,
  maxMileage: undefined,
};

export default function CatalogClientPage({
  initialFetchParams,
}: CatalogClientPageProps) {
  const [fetchParams, setFetchParams] =
    useState<CarFetchParams>(initialFetchParams);
  const [draftFilters, setDraftFilters] =
    useState<CarFetchParams>(initialFetchParams);
  const router = useRouter();
  const pathname = usePathname();

  const filtersQuery = useQuery({
    queryKey: ['filters'],
    queryFn: fetchCarFilters,
  });

  const {
    data: filters,
    isLoading: isFiltersLoading,
    isError: isFiltersError,
  } = filtersQuery;

  const carsQuery = useInfiniteQuery({
    queryKey: ['cars', fetchParams],
    queryFn: ({ queryKey, pageParam = 1 }) => {
      const [, params] = queryKey;
      return fetchCars({
        filters: params as CarFetchParams,
        page: pageParam,
        perPage: PAGE_SIZE,
      });
    },
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const { totalPages, page } = lastPage;
      const hasMore = page < totalPages;
      return hasMore ? page + 1 : undefined;
    },
    select: data => {
      return {
        ...data,
        cars: data.pages.flatMap(page => page.cars),
      };
    },
  });

  const {
    data,
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    isFetched,
  } = carsQuery;
  const cars = data?.cars ?? [];
  const hasCars = cars.length > 0;
  const disabledButton = isFetching || isFetchingNextPage;
  const isLoadingOrFetching = isLoading || isFetching || isFetchingNextPage;
  const showNoResultsMessage = isFetched && !isError && !hasCars;

  const formAction = async (formData: FormData) => {
    const values = Object.fromEntries(formData) as unknown as CarFetchParams;

    const newFetchParams: CarFetchParams = {
      brand: values.brand || undefined,
      price: values.price?.toString() || undefined,
      minMileage: values.minMileage || undefined,
      maxMileage: values.maxMileage || undefined,
    };

    setFetchParams(prev => ({
      ...prev,
      ...newFetchParams,
    }));

    const newSearchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(newFetchParams)) {
      if (value !== undefined && value !== '') {
        newSearchParams.set(key, String(value));
      }
    }

    const newUrl = `${pathname}?${newSearchParams.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  const clearFilters = () => {
    setDraftFilters(defaultFetchParams);
    setFetchParams(defaultFetchParams);
    router.push(pathname, { scroll: false });
  };

  const getPriceOptionsArray = () => {
    const minPrice = filters?.price?.min ?? 0;
    const maxPrice = filters?.price?.max ?? 0;
    const step = 10;

    const options: string[] = [];
    for (let price = minPrice; price <= maxPrice; price += step) {
      options.push(price.toString());
    }
    return options;
  };

  const priceOptions = getPriceOptionsArray();

  return (
    <div className={clsx(css.catalogContainer, `container`)}>
      <h1 className="visually-hidden">Car Catalog</h1>
      <section className={css.searchSection}>
        <h2 className="visually-hidden">Available filters</h2>
        <Search
          filters={filters}
          priceOptions={priceOptions}
          draftFilters={draftFilters}
          setDraftFilters={setDraftFilters}
          formAction={formAction}
          clearFilters={clearFilters}
        />
      </section>

      {showNoResultsMessage && <NotFound onReset={clearFilters} />}

      <section className={css.carsGrid}>
        <h2 className="visually-hidden">Cars list</h2>
        <CarsList cars={cars} />
        {isLoadingOrFetching && <Loader />}
      </section>

      {hasNextPage && (
        <button
          type="button"
          className={clsx(css.loadMoreButton, `button button_secondary`)}
          onClick={() => carsQuery.fetchNextPage()}
          disabled={disabledButton}
        >
          Load More
        </button>
      )}
    </div>
  );
}
