'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function UserInfo() {
  const { data: session } = useSession();
  const user = session?.user;

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  if (!session?.user || !user) return <span>Not logged in</span>;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="User menu"
        className="flex items-center space-x-2 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-700 relative">
          <Image src={user.image || '/avatar.jpg'} alt="User Avatar" fill style={{ objectFit: 'cover' }} sizes="32px" />
        </div>
        <span className="hidden md:inline">{user.name}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-white bg-shadow-lg rounded-xl z-50 min-w-[200px]">
          <ul>
            <li className="p-3 text-sm hover:bg-gray-100 cursor-pointer">
              <button onClick={() => signOut()} className="cursor-pointer">
                Wyloguj się
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
