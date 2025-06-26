'use client';

import { Notification } from '@/app/types/notification';
import { fetchWithToken } from '@/lib/api';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAlertStore } from '@/app/store/useAlertStore';
import Image from 'next/image';
import { getTimeAgo } from '@/app/utils/helpers';
import { groupNotificationsByDate, NotificationResponse } from './utils';

export default function NotificationInfo() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const addAlert = useAlertStore((state) => state.addAlert);

  const fetchNotifications = async () => {
    try {
      const response = await fetchWithToken(`/notifications`);
      const data: NotificationResponse[] = await response.json();
      setNotifications(data);
    } catch (error) {
      addAlert('error', `Coś poszło nie tak ${error}`);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    const { id, url, read } = notification;
    try {
      setOpen(false);
      router.push(url);
      if (!read) {
        await fetchWithToken(`/notifications/${id}/read`, { method: 'POST' });
        fetchNotifications();
      }
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const readNotificationsLength = notifications?.filter(({ read }) => !read)?.length;
  const groupedNotifications = groupNotificationsByDate(notifications);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Powiadomienia"
        className="cursor-pointer relative w-8 h-8 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="#9095a0ff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="hover:stroke-indigo-600 transition"
        >
          <path d="M10.268 21a2 2 0 0 0 3.464 0" />
          <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
        </svg>

        {readNotificationsLength > 0 && (
          <span className="absolute -top-1 right-0 w-4 h-4 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">
            {readNotificationsLength}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 bg-white bg-shadow-lg rounded-xl z-50 min-w-[250px] max-w-[400px]">
          <ul>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800">Wszystkie notyfikacje</h2>
            </div>
            {notifications.length === 0 && <li className="p-4 text-gray-500 text-sm">Brak powiadomień</li>}
            {Object.entries(groupedNotifications).map(([group, items]) => (
              <div key={group}>
                <p className="text-xs text-gray-500 mt-4 ml-4 mb-2">{group}</p>
                {items.map((n) => (
                  <li className="w-96" key={n.id}>
                    <div className="p4 space-y-4">
                      <div className="relative flex items-start space-x-3 p-4 hover:bg-purple-50 hover:bg-gray-100 transition">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                          {n.fromUser.image ? (
                            <Image
                              src={n.fromUser.image}
                              alt={`${n.fromUser.name} image`}
                              width={18}
                              height={18}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-xs text-white bg-gray-400 w-full h-full flex items-center justify-center">
                              {n.fromUser.name?.[0] || '?'}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {n.type === 'board-shared' ? 'Udostępnienie tablicy' : 'Usunięcie tablicy'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{getTimeAgo(n.createdAt)}</p>
                          <p className="text-sm text-gray-700 mt-1">
                            <span className="font-semibold">{n.fromUser.name}</span>{' '}
                            {n.type === 'board-shared' ? 'udostępnił ci tablicę' : 'usunął tablicę'}{' '}
                            <button
                              className="text-indigo-600 hover:underline cursor-pointer"
                              onClick={() => handleNotificationClick(n)}
                            >
                              {n.boardTitle}
                            </button>
                          </p>
                        </div>
                        {!n.read && <div className="w-2 h-2 bg-red-500 rounded-full mt-1"></div>}
                      </div>
                    </div>
                  </li>
                ))}
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
