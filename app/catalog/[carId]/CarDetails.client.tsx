'use client';

import { useParams } from 'next/navigation';

import { RentalForm } from '@/components/rental-form';
import { fetchCarById } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Car } from '@/types/car';
import { RENTAL_CONDITIONS } from '@/constants/pagination';

export default function CarDetailsPage() {
  const { carId } = useParams<{ carId: string }>();

  const {
    data: car,
    isLoading,
    error,
  } = useQuery<Car>({
    enabled: Boolean(carId),
    queryKey: ['note', carId],
    queryFn: () => fetchCarById(carId),
    refetchOnMount: false,
    staleTime: 1000 * 60, // 60 seconds
  });

  if (error || !car) {
    return (
      <div className="container">
        <h1>Car not found</h1>
        <p>The car you are looking for does not exist.</p>
      </div>
    );
  }

  const getRentalConditionsMap = () => {
    RENTAL_CONDITIONS.map(([key, value]) => ({
      key,
      value,
    }));
  };

  return (
    <div className="container details-layout">
      <article className="details-header">
        <div>
          <img
            src={car.img}
            alt={`${car.brand} ${car.model}`}
            className="details-image"
          />
          <section className="rental-form-section">
            <RentalForm carId={car.id} />
          </section>
        </div>
        <div className="details-content">
          <header>
            <h1>
              <span>
                {car.brand} {car.model}, {car.year}
              </span>
              <span>Article: {car.stockNumber}</span>
            </h1>
            <address>
              <span className="sr-only">{car.location.city}</span>,$nbsp;
              <span className="sr-only">{car.location.country}</span>
            </address>
            <p className="price">{car.rentalPrice} $</p>
          </header>
          <p>{car.description}</p>
          <section aria-labelledby="rental-conditions">
            <h2>Rental Conditions:</h2>
            <ul className="conditions-list">
              {RENTAL_CONDITIONS.map(([key, value]) => (
                <li key={key}>
                  <strong>{key}</strong> {value && `: ${value}`}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="car-specifications">
            <ul className="details-list">
              <li>Year: {car.year}</li>
              <li>Type: {car.type}</li>
              <li>Fuel consumption: {car.fuelConsumption}</li>
              <li>Engine: {car.engine}</li>
              <li>Mileage: {car.mileage.toLocaleString()} km</li>
            </ul>
          </section>
          <section aria-labelledby="features">
            <h2>Features</h2>
            <ul className="details-list">
              {[...car.features].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      </article>
    </div>
  );
}
