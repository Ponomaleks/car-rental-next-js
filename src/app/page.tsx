import Link from "next/link";

export default function Home() {
  return (
    <main className="hero">
      <div className="hero-content">
        <h1>Find your perfect rental car</h1>
        <p>
          RentalCar helps you quickly choose a car by brand, price and mileage. Browse the catalog and rent in
          minutes.
        </p>
        <Link href="/catalog" className="primary-button">
          View Catalog
        </Link>
      </div>
    </main>
  );
}
