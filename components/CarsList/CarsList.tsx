import { Car } from '@/types/car';

import css from './CarsList.module.css';
import CarCard from '../CarCard/CarCard';

interface CarsListProps {
  cars: Car[];
}

export default function CarsList({ cars }: CarsListProps) {
  return (
    <ul className={css.carsList}>
      {cars.map((car, index) => (
        <li key={car.id}>
          <CarCard car={car} priority={index < 8} />
        </li>
      ))}
    </ul>
  );
}
