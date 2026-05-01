// You could create a new component like RegisterSW.tsx
'use client';
import { useEffect } from 'react';

export default function RegisterSW() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          void registration.unregister();
        });
      });

      return;
    }

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => console.log('SW registered:', registration))
      .catch((error) => console.log('SW registration failed:', error));
  }, []);

  return null;
}
