import { redirect } from 'next/navigation';
import { Board } from '../types/board';
import { getSessionServer } from '@/lib/auth';

export default async function CreateBoardForm() {
  const session = await getSessionServer();

  async function handleCreateBoard(formData: FormData) {
    'use server';
    const title = formData.get('title') as string;
    if (!title) return;

    const res = await fetch(`${process.env.API_URL}/boards`, {
      method: 'POST',
      body: JSON.stringify({ title }),
      headers: { Authorization: `Bearer ${session?.backendTokens.accessToken}`, 'Content-Type': 'application/json' },
    });

    const board: Board = await res.json();

    if (!board?.id) return;

    redirect(`/board/${board.id}`);
  }

  return (
    <form action={handleCreateBoard} className="mt-4 flex gap-2">
      <input type="text" name="title" placeholder="Nazwa nowej tablicy" required className="border px-2 py-1 rounded" />
      <button type="submit" className="cursor-pointer bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
        Dodaj
      </button>
    </form>
  );
}
