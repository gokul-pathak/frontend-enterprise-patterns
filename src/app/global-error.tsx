'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#d32f2f' }}>Fatal Application Error</h1>
          <p style={{ color: '#666', marginBottom: '24px' }}>A critical error occurred that prevented the application from rendering.</p>
          <button 
            onClick={() => reset()}
            style={{ padding: '10px 20px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
