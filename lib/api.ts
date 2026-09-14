import type { Car } from "@/types/car";

const PAGE_SIZE_DEFAULT = 12

export interface CarFetchParams {
  brand?: string;
  price?: string;
  minMileage?: string;
  maxMileage?: string;
}

interface FetchCarsOptions {
  filters: CarFetchParams;
  page: number;
  perPage?: number;
}

export interface CarFilters {
  brands: string[];
  price: { min: number; max: number };
}

export interface RentalPayload {
  name: string;
  email: string;
  comment: string;
}

export interface CarsResponse {
  cars: Car[];
  "totalCars": number;
  "page": number;
  "totalPages": number;
  "perPage": number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(path, API_BASE_URL);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

async function parseCarsResponse(response: Response, page: number, perPage: number): Promise<CarsResponse> {
  const data = await response.json();
  const cars: Car[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.cars)
      ? data.cars
      : Array.isArray(data?.results)
        ? data.results
        : [];

  const responsePage = typeof data?.page === "number" ? data.page : page;
  const responsePerPage = typeof data?.perPage === "number" ? data.perPage : perPage;
  const totalCars = typeof data?.totalCars === "number" ? data.totalCars : cars.length;
  const totalPages = typeof data?.totalPages === "number" ? data.totalPages : Math.ceil(totalCars / perPage);
  const hasMore = page < totalPages;

  return {
    cars,
    totalCars,
    page: responsePage,
    totalPages: totalPages ?? (hasMore ? page + 1 : page),
    perPage: responsePerPage,
  };
}

export async function fetchCars({
  filters,
  page,
  perPage = PAGE_SIZE_DEFAULT
}: FetchCarsOptions): Promise<CarsResponse> {
  const response = await fetch(
    buildUrl("/cars", {
      page,
      perPage,
      brand: filters.brand,
      price: filters.price,
      minMileage: filters.minMileage,
      maxMileage: filters.maxMileage,
    }),
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Failed to load cars");
  }

  return parseCarsResponse(response, page, perPage);
}

export async function fetchCarFilters(): Promise<CarFilters> {
  const response = await fetch(buildUrl("/cars/filters"), { cache: "no-store" });

  if (!response.ok) {
    return {
      "brands": [
      ],
      "price": {
        min: 30,
        max: 80
      }
    };
  }

  const data = await response.json();
  return data;
}

export async function fetchCarById(carId: string): Promise<Car> {
  const response = await fetch(buildUrl(`/cars/${carId}`), { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Car not found");
  }

  return response.json();
}

export async function submitRental(id: number, payload: RentalPayload): Promise<void> {
  const response = await fetch(buildUrl(`${id}/booking-requests`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to submit rental request");
  }
}
