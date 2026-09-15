import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { cache } from 'react';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import CarDetailsPage from './CarDetails.client';
import { fetchCarById } from '@/lib/api';

export const dynamic = 'force-dynamic';

interface CarPageProps {
  params: Promise<{ carId: string }>;
}

const getCarById = cache((carId: string) => fetchCarById(carId));

export async function generateMetadata({
  params,
}: CarPageProps): Promise<Metadata> {
  const { carId } = await params;

  try {
    const car = await getCarById(carId);
    const carName = `${car.brand} ${car.model}`;
    const description = `Rent a ${carName} ${car.year} from ${car.rentalCompany}. ${car.description}`;

    return {
      title: `${carName} ${car.year}`,
      description,
      alternates: {
        canonical: `/catalog/${carId}`,
      },
      openGraph: {
        type: 'article',
        title: `${carName} ${car.year}`,
        description,
        url: `/catalog/${carId}`,
        images: [
          {
            url: car.img,
            alt: carName,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${carName} ${car.year}`,
        description,
        images: [car.img],
      },
    };
  } catch {
    return {
      title: 'Car Details',
      description: 'View rental details and submit a booking request.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function CarPage({ params }: CarPageProps) {
  const { carId } = await params;
  const queryClient = new QueryClient();
  let car;

  try {
    car = await getCarById(carId);
  } catch {
    notFound();
  }

  queryClient.setQueryData(['car', carId], car);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CarDetailsPage />
    </HydrationBoundary>
  );
}
