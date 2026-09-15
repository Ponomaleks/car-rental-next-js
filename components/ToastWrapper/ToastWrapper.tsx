'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastWrapper() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '14px',
          color: 'var(--main)',
          background: 'var(--white)',
          boxShadow: '0 4px 36px 0 rgba(0, 0, 0, 0.02)',
        },
      }}
    />
  );
}
