'use client';

import React from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function UserInfo() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <span>Loading...</span>;
  if (!session?.user) return <span>Not logged in</span>;

  const user = session.user;

  return (
    <>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          overflow: 'hidden',
          cursor: 'pointer',
          border: '2px solid #6f42c1',
          position: 'relative',
        }}
      >
        <Image src={user.image || '/avatar.jpg'} alt="User Avatar" fill style={{ objectFit: 'cover' }} sizes="32px" />
      </div>
      <span>{user.name}</span>
    </>
  );
}
