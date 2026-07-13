// You could create a new component like RegisterSW.tsx
'use client';
import { useEffect } from 'react';

export default function RegisterSW() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      const reloadKey = 'logicola-sw-dev-reloaded';

      navigator.serviceWorker.getRegistrations().then((registrations) => {
        Promise.all(
          registrations.map((registration) => registration.unregister())
        ).then(() => {
          if (navigator.serviceWorker.controller) {
            if (sessionStorage.getItem(reloadKey) !== 'true') {
              sessionStorage.setItem(reloadKey, 'true');
              window.location.reload();
            }

            return;
          }

          sessionStorage.removeItem(reloadKey);
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
