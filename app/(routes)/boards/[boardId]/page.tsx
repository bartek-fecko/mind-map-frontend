import { notFound } from 'next/navigation';
import { SocketProvider } from '@/app/providers/SocketProvider';
import Toolbar from '../../../components/Toolbar/Toolbar';
import Board from './Board';
import styles from './MindMap.module.css';
import { Board as IBoard } from '@/app/types/board';
import { getSessionServer } from '@/lib/auth';
import BoardsHeader from '@/app/components/Headers/BoardsHeader/BoardsHeader';

export default async function MindMap({ params }: { params: Promise<{ boardId: string }> }) {
  const awaitedParams = await params;
  const session = await getSessionServer();

  if (!session?.user) {
    notFound();
  }

  const response = await fetch(`${process.env.API_URL}/boards/${awaitedParams.boardId}`, {
    headers: { Authorization: `Bearer ${session?.backendTokens?.accessToken}`, 'Content-Type': 'application/json' },
  });

  if (response.status === 404 || response.status === 403) {
    return notFound();
  }

  const board: IBoard = await response.json();

  if (!board) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <BoardsHeader board={board} />
      <div className={styles.container}>
        <SocketProvider boardId={parseInt(awaitedParams.boardId, 10)} session={session}>
          <Toolbar />
          <Board />
        </SocketProvider>
      </div>
    </div>
  );
}
