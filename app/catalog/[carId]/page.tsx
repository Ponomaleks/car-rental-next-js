import { notFound } from 'next/navigation';
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

export default async function CarPage({ params }: CarPageProps) {
  const { carId } = await params;
  const queryClient = new QueryClient();

  await queryClient
    .query({
      queryKey: ['note', carId],
      queryFn: () => fetchCarById(carId),
    })
    .catch(() => {
      notFound();
    });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CarDetailsPage />
    </HydrationBoundary>
  );
}
