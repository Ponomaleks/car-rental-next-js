'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

import { CarFetchParams, fetchCarFilters, fetchCars } from '@/lib/api';
import { PAGE_SIZE } from '@/constants/pagination';
import Image from 'next/image';

interface CatalogClientPageProps {
  initialFetchParams: CarFetchParams;
}

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

  const formAction = async (formData: FormData) => {
    const values = Object.fromEntries(formData) as unknown as CarFetchParams;

    const newFetchParams: CarFetchParams = {
      brand: values.brand || undefined,
      price: values.price || undefined,
      minMileage: values.minMileage || undefined,
      maxMileage: values.maxMileage || undefined,
    };

    setFetchParams(newFetchParams);

    const newSearchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(newFetchParams)) {
      if (value !== undefined && value !== '') {
        newSearchParams.set(key, String(value));
      }
    }

    const newUrl = `${pathname}?${newSearchParams.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="container">
      <section className="filters">
        <form action={formAction}>
          <label>
            Car brand
            <select
              name="brand"
              value={draftFilters.brand ?? ''}
              onChange={event =>
                setDraftFilters(prev => ({
                  ...prev,
                  brand: event.target.value || undefined,
                }))
              }
            >
              <option value="">Choose a brand</option>
              {(filters?.brands ?? []).map(brand => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </label>

          <label>
            Price/ 1 hour
            <input
              name="price"
              type="number"
              min={filters?.price?.min ?? 0}
              max={filters?.price?.max ?? 0}
              value={draftFilters.price ?? ''}
              onChange={event =>
                setDraftFilters(prev => ({
                  ...prev,
                  rentalPrice: event.target.value || undefined,
                }))
              }
              placeholder="Choose a price"
            />
          </label>

          <fieldset>
            <legend>Сar mileage / km</legend>
            <input
              name="minMileage"
              type="number"
              min="0"
              value={draftFilters.minMileage ?? ''}
              onChange={event =>
                setDraftFilters(prev => ({
                  ...prev,
                  minMileage: event.target.value
                    ? event.target.value
                    : undefined,
                }))
              }
              placeholder="From"
            />
            <input
              name="maxMileage"
              type="number"
              min="0"
              value={draftFilters.maxMileage ?? ''}
              onChange={event =>
                setDraftFilters(prev => ({
                  ...prev,
                  maxMileage: event.target.value
                    ? event.target.value
                    : undefined,
                }))
              }
              placeholder="To"
            />
          </fieldset>

          <button type="submit" className="primary-button">
            Search
          </button>
        </form>
      </section>

      {carsQuery.isLoading && <p>Loading cars...</p>}
      {carsQuery.isError && <p>Unable to load cars. Please try again later.</p>}

      <section className="cars-grid">
        <ul>
          {cars.map(car => (
            <li key={car.id}>
              <article key={car.id} className="car-card">
                <Image
                  src={car.img}
                  alt={`${car.brand} ${car.model}`}
                  height={268}
                  width={244}
                  className="car-image"
                />
                <header>
                  <h2>
                    {car.brand} {car.model}, {car.year}
                  </h2>
                  <p className="price">{car.rentalPrice}</p>
                </header>
                <main>
                  <div>
                    <address>
                      <span className="sr-only">{car.location.country}</span>
                      <span className="sr-only">{car.location.city}</span>
                    </address>
                    <p className="sr-only">{car.rentalCompany}</p>
                  </div>
                  <p>
                    {car.type} • {car.mileage.toLocaleString()} km
                  </p>
                </main>
                <Link
                  href={`/catalog/${car.id}`}
                  className="primary-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read more
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {hasNextPage && (
        <button
          type="button"
          className="secondary-button"
          onClick={() => carsQuery.fetchNextPage()}
          disabled={disabledButton}
        >
          Load More
        </button>
      )}
    </div>
  );
}
