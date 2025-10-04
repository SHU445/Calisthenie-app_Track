import type { Metadata } from 'next';
import { pageMetadata, siteConfig } from '@/config/seo';

export const metadata: Metadata = {
  title: pageMetadata.auth.register.title,
  description: pageMetadata.auth.register.description,
  keywords: pageMetadata.auth.register.keywords,
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: pageMetadata.auth.register.title,
    description: pageMetadata.auth.register.description,
    url: `${siteConfig.url}/auth/register`,
    siteName: siteConfig.name,
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

