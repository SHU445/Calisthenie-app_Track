'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/stores/authStore';

export function useAuthSync() {
  const { data: session, status } = useSession();
  const syncWithSession = useAuthStore((state) => state.syncWithSession);

  useEffect(() => {
    if (status === 'loading') {
      // La session est en cours de chargement
      return;
    }

    if (status === 'authenticated' && session) {
      // L'utilisateur est connecté, synchroniser avec le store
      syncWithSession(session);
    } else if (status === 'unauthenticated') {
      // L'utilisateur n'est pas connecté, vider le store
      syncWithSession(null);
    }
  }, [session, status, syncWithSession]);

  return { session, status };
}
