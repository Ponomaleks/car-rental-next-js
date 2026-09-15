'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

import css from './CarDetails.module.css';
import { CarDetatilsInfo, RentalForm } from '@/components';
import { fetchCarById } from '@/lib/api';
import { Car } from '@/types/car';
import clsx from 'clsx';

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

  return (
    <div className={clsx(css.detailsContainer, `container`)}>
      <article className={css.detailsArticle}>
        <h1 className="visually-hidden">
          Car {car.brand}&nbsp;{car.model} details page
        </h1>
        <aside className={css.detailsAsideContainer}>
          <div className={css.detailsImageContainer}>
            <Image
              src={car.img}
              alt={`${car.brand} ${car.model}`}
              className={css.detailsImage}
              priority
              fill
              sizes="(max-width: 768px) 100vw, 244px"
            />
          </div>
          <RentalForm carId={car.id} />
        </aside>
        <CarDetatilsInfo car={car} />
      </article>
    </div>
  );
}
