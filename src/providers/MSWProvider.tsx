'use client';

import { useEffect, useState } from 'react';

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Dynamic import ensures this code is never bundled in production
      import('@/tests/mocks/browser').then(async ({ worker }) => {
        await worker.start({ 
          onUnhandledRequest: 'bypass',
          // Optionally silence warnings for unhandled requests if they get noisy
          quiet: false 
        });
        setMswReady(true);
      });
    } else {
      setMswReady(true);
    }
  }, []);

  // Delay rendering the app until MSW is ready to intercept requests
  if (!mswReady) {
    return null; // A simple loading state could go here if preferred
  }

  return <>{children}</>;
}
