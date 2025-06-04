'use client';

import '@/styles/tailwind.css';
import '@/styles/app.css';
import { useViewportHeight } from '@/hooks/useViewportHeight';

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  useViewportHeight();

  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.css"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Arapey:ital@0;1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;900&display=swap"
          rel="stylesheet"
        />

        <link rel="icon" href="/favicon/favicon-32x32.png" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
