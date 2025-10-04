import type { Metadata } from 'next';
import { pageMetadata, siteConfig } from '@/config/seo';

export const metadata: Metadata = {
  title: pageMetadata.progress.title,
  description: pageMetadata.progress.description,
  keywords: pageMetadata.progress.keywords,
  openGraph: {
    title: pageMetadata.progress.title,
    description: pageMetadata.progress.description,
    url: `${siteConfig.url}/progres`,
    siteName: siteConfig.name,
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: pageMetadata.progress.title,
    description: pageMetadata.progress.description,
  },
  alternates: {
    canonical: `${siteConfig.url}/progres`,
  },
};

export default function ProgresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

