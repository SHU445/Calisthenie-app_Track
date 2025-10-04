import type { Metadata } from 'next';
import { pageMetadata, siteConfig } from '@/config/seo';

export const metadata: Metadata = {
  title: pageMetadata.auth.login.title,
  description: pageMetadata.auth.login.description,
  keywords: pageMetadata.auth.login.keywords,
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: pageMetadata.auth.login.title,
    description: pageMetadata.auth.login.description,
    url: `${siteConfig.url}/auth/login`,
    siteName: siteConfig.name,
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

