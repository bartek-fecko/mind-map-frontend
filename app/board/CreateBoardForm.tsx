import { redirect } from 'next/navigation';
import { Board } from '../types/board';
import { fetchApi } from '@/lib/api';

export default function CreateBoardForm() {
  async function handleCreateBoard(formData: FormData) {
    'use server';

    const title = formData.get('title') as string;
    if (!title) return;

    const board = await fetchApi<Board>('/boards', {
      method: 'POST',
      body: JSON.stringify({ title }),
      headers: { 'Content-Type': 'application/json' },
    });

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
