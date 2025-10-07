import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Paramètres - Callisthénie Tracker',
  description: 'Gérez votre compte et personnalisez votre expérience',
};

export default function ParametresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

