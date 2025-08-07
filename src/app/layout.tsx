import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Calisthénie Tracker',
  description: 'Application de suivi d\'entraînements de calisthénie avec thème sportif moderne',
  keywords: ['calisthénie', 'fitness', 'tracker', 'sport', 'entraînement'],
  authors: [{ name: 'Calisthénie Tracker Team' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="antialiased">
        <div className="min-h-screen bg-sport-dark text-white">
          {children}
        </div>
      </body>
    </html>
  );
} 