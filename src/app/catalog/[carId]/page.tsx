import { notFound } from "next/navigation";

import { RentalForm } from "@/components/rental-form";
import { fetchCarById } from "@/lib/api";

export const dynamic = "force-dynamic";

interface CarPageProps {
  params: Promise<{ carId: string }>;
}

export default async function CarPage({ params }: CarPageProps) {
  const { carId } = await params;
  const car = await fetchCarById(carId).catch(() => null);

  if (!car) {
    notFound();
  }

  return (
    <main className="container details-layout">
      <section>
        <img src={car.img} alt={`${car.brand} ${car.model}`} className="details-image" />
        <h1>
          {car.brand} {car.model}, {car.year}
        </h1>
        <p>{car.description}</p>
        <ul className="details-list">
          <li>Type: {car.type}</li>
          <li>Fuel consumption: {car.fuelConsumption}</li>
          <li>Engine size: {car.engineSize}</li>
          <li>Address: {car.address}</li>
          <li>Rental company: {car.rentalCompany}</li>
          <li>Mileage: {car.mileage.toLocaleString()} km</li>
        </ul>
        <h2>Accessories and functionalities</h2>
        <ul className="details-list">
          {[...car.accessories, ...car.functionalities].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <RentalForm carId={car.id} />
    </main>
  );
}
