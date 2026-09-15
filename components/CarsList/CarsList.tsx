import { Car } from '@/types/car';

import css from './CarsList.module.css';
import CarCard from '../CarCard/CarCard';

interface CarsListProps {
  cars: Car[];
}

export default function CarsList({ cars }: CarsListProps) {
  return (
    <ul className={css.carsList}>
      {cars.map(car => (
        <li key={car.id}>
          <CarCard car={car} />
        </li>
      ))}
    </ul>
  );
}
