import type { Car, CarsResponse } from "@/types/car";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://car-rental-api.goit.global";

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

async function parseCarsResponse(response: Response, page: number, limit: number): Promise<CarsResponse> {
  const data = await response.json();
  const cars: Car[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.cars)
      ? data.cars
      : Array.isArray(data?.results)
        ? data.results
        : [];

  const totalPages = typeof data?.totalPages === "number" ? data.totalPages : undefined;
  const hasMore = totalPages ? page < totalPages : cars.length === limit;

  return { cars, hasMore };
}

export interface CarFilters {
  brand?: string;
  rentalPrice?: string;
  minMileage?: number;
  maxMileage?: number;
}

export async function fetchCars(filters: CarFilters, page: number, limit = 8): Promise<CarsResponse> {
  const response = await fetch(
    buildUrl("/cars", {
      page,
      limit,
      brand: filters.brand,
      rentalPrice: filters.rentalPrice,
      minMileage: filters.minMileage,
      maxMileage: filters.maxMileage,
    }),
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Failed to load cars");
  }

  return parseCarsResponse(response, page, limit);
}

export async function fetchBrands(): Promise<string[]> {
  const response = await fetch(buildUrl("/brands"), { cache: "no-store" });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchCarById(carId: string): Promise<Car> {
  const response = await fetch(buildUrl(`/cars/${carId}`), { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Car not found");
  }

  return response.json();
}

export interface RentalPayload {
  carId: number;
  name: string;
  email: string;
  phone: string;
  rentalDate: string;
  comment: string;
}

export async function submitRental(payload: RentalPayload): Promise<void> {
  const response = await fetch(buildUrl("/rentals"), {
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
