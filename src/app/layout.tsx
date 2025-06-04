'use client';

import { Metadata } from 'next';
import * as React from 'react';

import '@/styles/tailwind.css';
import '@/styles/app.css';

import { siteConfig } from '@/constant/config';
import { useViewportHeight } from '@/hooks/useViewportHeight';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: '/favicon/site.webmanifest',
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [`${siteConfig.url}/og/og.jpg`],
    type: 'website',
    locale: 'es_MX',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/og.jpg`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useViewportHeight(); // ✅ Se ejecuta solo una vez globalmente

  return (
    <html lang='es'>
      <head>
        <meta charSet='UTF-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />

        <link
          rel='stylesheet'
          href='https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.css'
        />

        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap'
          rel='stylesheet'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Arapey:ital@0;1&display=swap'
          rel='stylesheet'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;900&display=swap'
          rel='stylesheet'
        />

        <link rel='icon' href='/favicon/favicon-32x32.png' type='image/png' />
      </head>
      <body>{children}</body>
    </html>
  );
}
