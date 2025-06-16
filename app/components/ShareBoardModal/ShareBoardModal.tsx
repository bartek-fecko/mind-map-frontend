'use client';

import { fetchApi } from '@/lib/api';
import { useEffect, useState } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  joined: string;
  role: string;
  avatarUrl: string;
};

const users: User[] = [
  {
    id: 1,
    name: 'Ryan Anscher',
    email: 'ryananscher@gmail.com',
    joined: 'June 8, 2023',
    role: 'Admin',
    avatarUrl: 'https://i.pravatar.cc/40?img=1',
  },
  {
    id: 2,
    name: 'Ashley Robinson',
    email: 'ashleyrobinson@gmail.com',
    joined: 'June 2, 2023',
    role: 'Admin',
    avatarUrl: 'https://i.pravatar.cc/40?img=2',
  },
];

export default function ShareBoardModal() {
  useEffect(() => {
    const getUsers = async () => {
      const users = await fetchApi('/users');
      console.log(users);
    };

    getUsers();
  }, []);
  const [selectedRoles, setSelectedRoles] = useState(users.map((user) => user.role));

  const handleRoleChange = (index: number, newRole: string) => {
    const updatedRoles = [...selectedRoles];
    updatedRoles[index] = newRole;
    setSelectedRoles(updatedRoles);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-md w-full max-w-2xl p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Share board</h2>
          <button>X</button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
            <svg
              className="w-4 h-4 text-gray-400 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1111.5 4.5a7.5 7.5 0 015.15 12.15z" />
            </svg>
            <input type="text" placeholder="Search" className="w-full bg-transparent outline-none text-sm" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden border rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="p-3 text-left font-medium">Name</th>
                <th className="p-3 text-left font-medium">Email</th>
                <th className="p-3 text-left font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id} className="border-t last:border-b">
                  <td className="flex items-center gap-3 p-3">
                    <input type="checkbox" className="form-checkbox" />
                    <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="font-medium text-sm">{user.name}</div>
                      <div className="text-gray-500 text-xs">{user.email}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <select
                      value={selectedRoles[idx]}
                      onChange={(e) => handleRoleChange(idx, e.target.value)}
                      className="border bg-gray-50 rounded-md px-2 py-1 text-sm outline-none"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Viewer">Viewer</option>
                      <option value="Editor">Editor</option>
                    </select>
                  </td>
                  <td className="p-3 text-gray-500 text-sm">{user.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <button className="px-4 py-2 text-sm text-gray-600 rounded hover:bg-gray-100">Cancel</button>
          <button className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-500">Save</button>
        </div>
      </div>
    </div>
  );
}
