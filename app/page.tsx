import Link from 'next/link';
import { getBoards } from '@/lib/api';
import CreateBoardForm from './board/CreateBoardForm';

export default async function HomePage() {
  const boards = await getBoards();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Wybierz tablicę:</h1>
      <ul>
        {boards.map((board) => (
          <li key={board.id}>
            <Link href={`/board/${board.id}`} className="text-blue-500 underline">
              {board.title}
            </Link>
          </li>
        ))}
      </ul>

      <CreateBoardForm />
    </div>
  );
}
