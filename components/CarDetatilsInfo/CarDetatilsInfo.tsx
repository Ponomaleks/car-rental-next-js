import { RENTAL_CONDITIONS } from '@/constants/pagination';
import { Car } from '@/types/car';
import css from './CarDetatilsInfo.module.css';
import { IoCarSportOutline, IoLocationOutline } from 'react-icons/io5';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { BsCalendar4Week, BsFuelPump } from 'react-icons/bs';
import { PiRoadHorizonLight } from 'react-icons/pi';
import { FiSettings } from 'react-icons/fi';

interface CarDetatilsInfoProps {
  car: Car;
}

const getRentalConditions = () =>
  RENTAL_CONDITIONS.map(([key, value]) => ({
    key,
    value,
  }));

const rentalConditions = getRentalConditions();

export default function CarDetatilsInfo({ car }: CarDetatilsInfoProps) {
  return (
    <div className={css.detailsInfoContainer}>
      <header className={css.header}>
        <div className={css.mainTitleWrapper}>
          <h2
            className={css.mainTitle}
            title={`${car.brand} ${car.model}, ${car.year}`}
          >
            <span>
              {car.brand} {car.model}, {car.year}
            </span>
          </h2>
          <span className={css.article}>Article: {car.stockNumber}</span>
        </div>
        <address className={css.address}>
          <IoLocationOutline
            size={16}
            className={css.locationIcon}
            aria-hidden="true"
          />
          <span className="sr-only">{car.location.city}</span>,&nbsp;
          <span className="sr-only">{car.location.country}</span>
        </address>
        <p className={css.price}>${car.rentalPrice}</p>
      </header>
      <p className={css.description}>{car.description}</p>
      <section className={css.rentalConditions}>
        <h3 className={css.sectionTitle}>Rental Conditions:</h3>
        <ul className="conditions-list">
          {rentalConditions.map(({ key, value }) => (
            <li key={key} className={css.descriptionItem}>
              <FaRegCircleCheck aria-hidden="true" />
              <strong>
                {key}
                {value && `: ${value}`}
              </strong>
            </li>
          ))}
        </ul>
      </section>
      <section className={css.sectionTitle}>
        <h3 className={css.sectionTitle}>Car Specifications:</h3>
        <ul className="details-list">
          <li className={css.descriptionItem}>
            {' '}
            <BsCalendar4Week aria-hidden="true" />
            Year: {car.year}
          </li>
          <li className={css.descriptionItem}>
            <IoCarSportOutline aria-hidden="true" />
            Type: {car.type}
          </li>
          <li className={css.descriptionItem}>
            <BsFuelPump aria-hidden="true" />
            Fuel consumption: {car.fuelConsumption}
          </li>
          <li className={css.descriptionItem}>
            <FiSettings aria-hidden="true" />
            Engine: {car.engine}
          </li>
          <li className={css.descriptionItem}>
            <PiRoadHorizonLight aria-hidden="true" />
            Mileage: {car.mileage.toLocaleString()} km
          </li>
        </ul>
      </section>
      <section>
        <h3 className={css.sectionTitle}>Features</h3>
        <ul className="details-list">
          {[...car.features].map(item => (
            <li className={css.descriptionItem} key={item}>
              <FaRegCircleCheck aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
