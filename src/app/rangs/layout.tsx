import type { Metadata } from 'next';
import { pageMetadata, siteConfig } from '@/config/seo';

export const metadata: Metadata = {
  title: pageMetadata.ranks.title,
  description: pageMetadata.ranks.description,
  keywords: pageMetadata.ranks.keywords,
  openGraph: {
    title: pageMetadata.ranks.title,
    description: pageMetadata.ranks.description,
    url: `${siteConfig.url}/rangs`,
    siteName: siteConfig.name,
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: pageMetadata.ranks.title,
    description: pageMetadata.ranks.description,
  },
  alternates: {
    canonical: `${siteConfig.url}/rangs`,
  },
};

export default function RangsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

