'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { useAuthSync } from '@/hooks/useAuthSync';

interface NextAuthProviderProps {
  children: ReactNode;
}

function AuthSyncWrapper({ children }: { children: ReactNode }) {
  useAuthSync();
  return <>{children}</>;
}

export default function NextAuthProvider({ children }: NextAuthProviderProps) {
  return (
    <SessionProvider>
      <AuthSyncWrapper>
        {children}
      </AuthSyncWrapper>
    </SessionProvider>
  );
}
