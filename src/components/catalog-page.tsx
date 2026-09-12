"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo, useState } from "react";

import { fetchBrands, fetchCars, type CarFilters } from "@/lib/api";

const PAGE_SIZE = 8;

export function CatalogPage() {
  const [draftFilters, setDraftFilters] = useState<CarFilters>({});
  const [activeFilters, setActiveFilters] = useState<CarFilters>({});

  const brandsQuery = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
  });

  const carsQuery = useInfiniteQuery({
    queryKey: ["cars", activeFilters],
    queryFn: ({ pageParam }) => fetchCars(activeFilters, pageParam, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length + 1 : undefined),
  });

  const cars = useMemo(
    () => carsQuery.data?.pages.flatMap((page) => page.cars) ?? [],
    [carsQuery.data?.pages],
  );

  function applyFilters() {
    setActiveFilters({
      brand: draftFilters.brand || undefined,
      rentalPrice: draftFilters.rentalPrice || undefined,
      minMileage: draftFilters.minMileage || undefined,
      maxMileage: draftFilters.maxMileage || undefined,
    });
  }

  return (
    <main className="container">
      <h1 className="page-title">Catalog</h1>

      <section className="filters">
        <label>
          Brand
          <select
            value={draftFilters.brand ?? ""}
            onChange={(event) =>
              setDraftFilters((prev) => ({
                ...prev,
                brand: event.target.value || undefined,
              }))
            }
          >
            <option value="">All brands</option>
            {(brandsQuery.data ?? []).map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </label>

        <label>
          Price / 1 hour
          <input
            type="number"
            min="0"
            value={draftFilters.rentalPrice ?? ""}
            onChange={(event) =>
              setDraftFilters((prev) => ({
                ...prev,
                rentalPrice: event.target.value || undefined,
              }))
            }
            placeholder="Any"
          />
        </label>

        <label>
          Mileage from
          <input
            type="number"
            min="0"
            value={draftFilters.minMileage ?? ""}
            onChange={(event) =>
              setDraftFilters((prev) => ({
                ...prev,
                minMileage: event.target.value ? Number(event.target.value) : undefined,
              }))
            }
            placeholder="From"
          />
        </label>

        <label>
          Mileage to
          <input
            type="number"
            min="0"
            value={draftFilters.maxMileage ?? ""}
            onChange={(event) =>
              setDraftFilters((prev) => ({
                ...prev,
                maxMileage: event.target.value ? Number(event.target.value) : undefined,
              }))
            }
            placeholder="To"
          />
        </label>

        <button type="button" className="primary-button" onClick={applyFilters}>
          Search
        </button>
      </section>

      {carsQuery.isLoading && <p>Loading cars...</p>}
      {carsQuery.isError && <p>Unable to load cars. Please try again later.</p>}

      <section className="cars-grid">
        {cars.map((car) => (
          <article key={car.id} className="car-card">
            <img src={car.img} alt={`${car.brand} ${car.model}`} className="car-image" />
            <h2>
              {car.brand} {car.model}, {car.year}
            </h2>
            <p>
              {car.address} • {car.rentalCompany}
            </p>
            <p>
              {car.type} • {car.mileage.toLocaleString()} km
            </p>
            <p className="price">{car.rentalPrice}</p>
            <Link href={`/catalog/${car.id}`} className="primary-button" target="_blank" rel="noopener noreferrer">
              Read more
            </Link>
          </article>
        ))}
      </section>

      {carsQuery.hasNextPage && (
        <button
          type="button"
          className="secondary-button"
          onClick={() => carsQuery.fetchNextPage()}
          disabled={carsQuery.isFetchingNextPage}
        >
          {carsQuery.isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
    </main>
  );
}
