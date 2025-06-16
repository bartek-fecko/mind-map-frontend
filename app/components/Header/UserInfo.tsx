'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

type User = {
  name: string;
  image?: string;
};

export default function UserInfo() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) return <span>Loading...</span>;
  if (!user) return <span>Not logged in</span>;

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
