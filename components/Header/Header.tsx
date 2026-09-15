'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import css from './Header.module.css';
import logoSrc from '@/public/images/logo.png';
import clsx from 'clsx';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/catalog', label: 'Catalog' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={css.header}>
      <nav className={clsx(css.navigation, 'container')}>
        <Link href="/" className={css.logo} aria-label="RentalCar - Home">
          <Image
            src={logoSrc}
            alt="RentalCar Logo"
            width={104}
            height={16}
            priority
          />
        </Link>
        <ul className={css.navLinks}>
          {navItems.map(({ href, label }) => {
            const isActive =
              href === '/' ? pathname === href : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  className={clsx(css.navLink, isActive && css.active)}
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
