import type { Metadata } from 'next';
import { pageMetadata, siteConfig } from '@/config/seo';

export const metadata: Metadata = {
  title: pageMetadata.exercises.title,
  description: pageMetadata.exercises.description,
  keywords: pageMetadata.exercises.keywords,
  openGraph: {
    title: pageMetadata.exercises.title,
    description: pageMetadata.exercises.description,
    url: `${siteConfig.url}/exercices`,
    siteName: siteConfig.name,
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: pageMetadata.exercises.title,
    description: pageMetadata.exercises.description,
  },
  alternates: {
    canonical: `${siteConfig.url}/exercices`,
  },
};

export default function ExercicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

