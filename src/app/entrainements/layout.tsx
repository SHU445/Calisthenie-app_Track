import type { Metadata } from 'next';
import { pageMetadata, siteConfig } from '@/config/seo';

export const metadata: Metadata = {
  title: pageMetadata.workouts.title,
  description: pageMetadata.workouts.description,
  keywords: pageMetadata.workouts.keywords,
  openGraph: {
    title: pageMetadata.workouts.title,
    description: pageMetadata.workouts.description,
    url: `${siteConfig.url}/entrainements`,
    siteName: siteConfig.name,
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: pageMetadata.workouts.title,
    description: pageMetadata.workouts.description,
  },
  alternates: {
    canonical: `${siteConfig.url}/entrainements`,
  },
};

export default function EntrainementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

