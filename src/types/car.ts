export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  type: string;
  img: string;
  description: string;
  fuelConsumption: string;
  engineSize: string;
  accessories: string[];
  functionalities: string[];
  rentalPrice: string;
  rentalCompany: string;
  address: string;
  mileage: number;
}

export interface CarsResponse {
  cars: Car[];
  hasMore: boolean;
}
