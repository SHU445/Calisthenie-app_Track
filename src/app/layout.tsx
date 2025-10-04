import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { defaultMetadata } from '@/config/seo';
import JsonLd, { organizationSchema, webApplicationSchema, websiteSchema } from '@/components/JsonLd';

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0f1318' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <head>
        {/* Données structurées JSON-LD pour le SEO */}
        <JsonLd data={organizationSchema} />
        <JsonLd data={webApplicationSchema} />
        <JsonLd data={websiteSchema} />
        
        {/* Preconnect pour améliorer les performances */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="antialiased">
        <div className="min-h-screen bg-sport-dark text-white">
          {children}
        </div>
      </body>
    </html>
  );
} 