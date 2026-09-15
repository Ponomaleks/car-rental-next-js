import axios from "axios";
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

export interface RentalResponse {
  message: string;
}

export interface CarsResponse {
  cars: Car[];
  "totalCars": number;
  "page": number;
  "totalPages": number;
  "perPage": number;
}

interface CarsApiData {
  cars?: unknown;
  results?: unknown;
  page?: unknown;
  perPage?: unknown;
  totalCars?: unknown;
  totalPages?: unknown;
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

function parseCarsResponse(data: unknown, page: number, perPage: number): CarsResponse {
  const responseData: CarsApiData = typeof data === "object" && data !== null ? data : {};
  const cars: Car[] = Array.isArray(data)
    ? data
    : Array.isArray(responseData.cars)
      ? responseData.cars
      : Array.isArray(responseData.results)
        ? responseData.results
        : [];

  const responsePage = typeof responseData.page === "number" ? responseData.page : page;
  const responsePerPage = typeof responseData.perPage === "number" ? responseData.perPage : perPage;
  const totalCars = typeof responseData.totalCars === "number" ? responseData.totalCars : cars.length;
  const totalPages = typeof responseData.totalPages === "number" ? responseData.totalPages : Math.ceil(totalCars / perPage);
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
  try {
    const response = await axios.get(
      buildUrl("/cars", {
        page,
        perPage,
        brand: filters.brand,
        price: filters.price,
        minMileage: filters.minMileage,
        maxMileage: filters.maxMileage,
      }),
    );

    return parseCarsResponse(response.data, page, perPage);
  } catch {
    throw new Error("Failed to load cars");
  }
}

export async function fetchCarFilters(): Promise<CarFilters> {
  try {
    const response = await axios.get<CarFilters>(buildUrl("/cars/filters"));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        "brands": [
        ],
        "price": {
          min: 30,
          max: 80
        }
      };
    }

    throw error;
  }
}

export async function fetchCarById(carId: string): Promise<Car> {
  try {
    const response = await axios.get<Car>(buildUrl(`/cars/${carId}`));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error("Car not found");
    }

    throw error;
  }
}

export async function submitRental(id: number, payload: RentalPayload): Promise<RentalResponse> {
  try {
    const response = await axios.post<RentalResponse>(
      buildUrl(`/cars/${id}/booking-requests`),
      payload,
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error("Failed to submit rental request");
    }

    throw error;
  }
}
