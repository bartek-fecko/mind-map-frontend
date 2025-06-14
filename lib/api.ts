import { Board } from '@/app/types/board';

export async function getBoards(): Promise<Board[]> {
  const res = await fetch(`${process.env.API_URL}/boards`, { cache: 'no-store' });
  return res.json();
}

export async function createBoard(title: string): Promise<Board> {
  try {
    const res = await fetch(`${process.env.API_URL}/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
