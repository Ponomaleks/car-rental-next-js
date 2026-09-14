export interface Car {
  id: number;
  year: number;
  brand: string;
  model: string;
  type: string;
  img: string;
  description: string;
  fuelConsumption: string;
  engine: string;
  stockNumber: string;
  features: string[];
  rentalPrice: string;
  rentalCompany: string;
  location: {
    "country": string,
    "city": string,
    "address": string
  };
  rentalConditions: string[];
  mileage: number;
}

