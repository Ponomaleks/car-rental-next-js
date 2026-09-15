import Link from 'next/link';
import type { Metadata } from 'next';

import css from './page.module.css';
import clsx from 'clsx';

export const metadata: Metadata = {
  title: 'Find Your Perfect Rental Car',
  description:
    'Browse reliable and budget-friendly rental cars for your next journey.',
  openGraph: {
    title: 'Find Your Perfect Rental Car',
    description:
      'Browse reliable and budget-friendly rental cars for your next journey.',
    url: '/',
  },
};

export default function Home() {
  return (
    <div className={css.hero}>
      <div className={css.heroContent}>
        <h1 className={css.title}>Find your perfect rental car</h1>
        <p className={css.description}>
          Reliable and budget-friendly rentals for any journey
        </p>
        <Link
          href="/catalog"
          className={clsx(css.ctaButton, 'button', 'button_primary')}
          aria-label="View Catalog"
        >
          View Catalog
        </Link>
      </div>
    </div>
  );
}
