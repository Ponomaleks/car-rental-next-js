import { Car } from '@/types/car';
import Image from 'next/image';
import Link from 'next/link';

import css from './CarCard.module.css';

interface CarProps {
  car: Car;
  priority?: boolean;
}

export default function CarCard({ car, priority = false }: CarProps) {
  return (
    <article className={css.carCard}>
      <div className={css.imgContainer}>
        <Image
          src={car.img}
          alt={`${car.brand} ${car.model}`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 244px"
          className={css.img}
        />
      </div>
      <header className={css.carHeader}>
        <h3
          className={css.carTitle}
          title={`${car.brand} ${car.model}, ${car.year}`}
        >
          {car.brand}&nbsp;<span className={css.accent}>{car.model}</span>,{' '}
          {car.year}
        </h3>
        <p className={css.price}>${car.rentalPrice}</p>
      </header>
      <main className={css.carDetails}>
        <div className={css.location}>
          <address>
            <span className={css.address}>{car.location.country}</span>
            <span className={css.address}>{car.location.city}</span>
          </address>
          <p className={css.rentalCompany}>{car.rentalCompany}</p>
        </div>
        <p className={css.carInfo}>
          <span className={css.carType}>{car.type}</span>
          <span className={css.carMileage}>
            {car.mileage.toLocaleString()} km
          </span>
        </p>
      </main>
      <Link
        href={`/catalog/${car.id}`}
        className="button button_primary"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Read more about ${car.brand} ${car.model}`}
      >
        Read more
      </Link>
    </article>
  );
}
