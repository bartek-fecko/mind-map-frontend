'use client';

import { useEffect, useState } from 'react';
import Modal from '../Modal';
import SearchInput from '@/app/components/Input/SearchInput';
import Select from '@/app/components/Input/Select';
import Checkbox from '@/app/components/Input/Checkbox';
import Image from 'next/image';
import { useAlertStore } from '@/app/store/useAlertStore';
import { User } from '@/app/types/user';
import { formatDate } from '@/app/utils/helpers';
import useDebounce from '@/app/utils/useDebounce';
import { useSession } from 'next-auth/react';
import { fetchWithToken } from '@/lib/api';
import Button from '@/app/components/Button/Button';

interface ShareBoardModalProps {
  id: string;
  title: string;
  onClose: () => void;
}

type UserWithBoards = User & {
  boards: { boardId: string }[];
};

export default function ShareBoardModal({ id, title, onClose }: ShareBoardModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const addAlert = useAlertStore((state) => state.addAlert);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [userRoles, setUserRoles] = useState<Record<string, string>>({});
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const getAllUsers = async (search: string = '') => {
    setLoading(true);
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_SOCKET_URL}/users/`);
      if (search) url.searchParams.append('search', search);

      const response = await fetch(url.toString());
      const users: UserWithBoards[] = await response.json();

      const filteredUsers = users.filter((user) => {
        if (user.id === currentUserId) return false;

        const hasBoard = user.boards.some((b) => b.boardId === id);
        return !hasBoard;
      });

      setUsers(filteredUsers);
    } catch (e) {
      addAlert('error', `Wystąpił błąd: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleRoleChange = (userId: string, role: string) => {
    setUserRoles((prev) => ({
      ...prev,
      [userId]: role,
    }));
  };

  const handleSave = async () => {
    const selected = Array.from(selectedUsers).map((userId) => ({
      userId,
      role: userRoles[userId] || 'viewer',
      email: users.find(({ id }) => userId === id)?.email,
    }));
    try {
      const response = await fetchWithToken(`/boards/${id}/share`, {
        method: 'POST',
        body: JSON.stringify({
          email: selected[0].email,
          role: selected[0].role,
          boardTitle: title,
        }),
      });

      if (response?.ok) {
        addAlert('success', 'Pomyślnie udostępniono tablice');
      }
      if (!response?.ok) {
        const error = await response?.json();
        addAlert('error', `Wystąpił błąd: ${error?.message}`);
      }
    } catch (e) {
      addAlert('error', `Wystąpił błąd: ${e}`);
    } finally {
      setLoading(false);
    }

    onClose();
  };

  useEffect(() => {
    getAllUsers(searchTerm);
  }, [debouncedSearchTerm]);

  const skeletonRows = Array(1).fill(0);

  return (
    <Modal title={`Udostepnij tablicę ${title}`} wrapperClassName="flex flex-col max-h-[450px]" onClose={onClose}>
      <div className="mb-4">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Szukaj użytkownika..."
        />
      </div>

      <div className="overflow-auto rounded-md border border-gray-200 max-h-[300px]">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-50 uppercase text-xs sticky top-0 z-10 border-b border-gray-200">
            <tr>
              <th className="text-left font-medium text-sm text-[#6B7280] pl-16 pt-[17px] pb-2 rounded-tl-lg">Nazwa</th>
              <th className="text-left font-medium text-sm text-[#6B7280] pl-3 pt-[17px] pb-2">Przywileje</th>
              <th className="text-left font-medium text-sm text-[#6B7280] pl-3 pt-[17px] pb-2 rounded-tr-lg">
                Dołączył
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              skeletonRows.map((_, idx) => (
                <tr key={idx} className="border-b border-gray-200 last:border-b-0 h-[85px] animate-pulse">
                  <td className="flex items-center gap-3 p-5">
                    <div className="w-5 h-5 bg-gray-300 rounded" />
                    <div className="w-9 h-9 bg-gray-300 rounded-full" />
                    <div className="flex flex-col gap-2">
                      <div className="w-24 h-4 bg-gray-300 rounded"></div>
                      <div className="w-32 h-3 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="w-20 h-5 bg-gray-300 rounded"></div>
                  </td>
                  <td className="p-3">
                    <div className="w-16 h-5 bg-gray-300 rounded"></div>
                  </td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center h-[85px] text-gray-500">
                  Brak wyników
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 last:border-b-0 h-[85px]">
                  <td className="flex items-center gap-3 p-5">
                    <Checkbox
                      className="pr-[6px]"
                      checked={selectedUsers.has(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                    />
                    <Image
                      src={user.image || '/'}
                      alt={user.name || 'brak imienia'}
                      width={24}
                      height={24}
                      className="w-9 h-9 rounded-full"
                    />
                    <div>
                      <div className="font-normal text-sm text-label-base leading-[22px]">{user.name}</div>
                      <div className="font-normal text-gray-500 text-sm text-label-secondary leading-[22px]">
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <Select
                      options={[
                        { label: 'Admin', value: 'admin' },
                        { label: 'Oglądający', value: 'viewer' },
                        { label: 'Edytujący', value: 'editor' },
                      ]}
                      value={userRoles[user.id] || 'viewer'}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={!selectedUsers.has(user.id)}
                    />
                  </td>
                  <td className="p-3 text-sm text-[#2E2E2EFF] font-normal whitespace-nowrap">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-3 pt-3 mt-auto">
        <Button variant="secondary" onClick={onClose}>
          Anuluj
        </Button>
        <Button onClick={handleSave} disabled={!selectedUsers?.size}>
          Zapisz
        </Button>
      </div>
    </Modal>
  );
}
