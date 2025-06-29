'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function SessionChecker() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.error === 'TokenExpired') {
      signOut({ callbackUrl: '/login' });
    }
  }, [session, status]);

  return null;
}
