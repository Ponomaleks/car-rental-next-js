import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';

import './globals.css';
import Header from '@/components/Header/Header';
import clsx from 'clsx';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'RentalCar App',
  description: 'Car rental frontend application',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'icon',
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
      },
      {
        rel: 'icon',
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={clsx(manrope.variable, 'page')}>
      <body>
        <TanStackProvider>
          <Header />
          <main className="app">{children}</main>
        </TanStackProvider>
      </body>
    </html>
  );
}
