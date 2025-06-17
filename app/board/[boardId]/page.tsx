import { notFound } from 'next/navigation';
import { SocketProvider } from '@/app/providers/SocketProvider';
import Toolbar from '../../components/Toolbar/Toolbar';
import Canvas from '../Board';
import styles from './MindMap.module.css';
import { Board } from '@/app/types/board';
import { getSessionServer } from '@/lib/auth';

export default async function MindMap({ params }: { params: Promise<{ boardId: string }> }) {
  const awaitedParams = await params;
  const session = await getSessionServer();

  if (!session?.user) {
    notFound();
  }

  const response = await fetch(`${process.env.API_URL}/boards/${awaitedParams.boardId}`, {
    headers: { Authorization: `Bearer ${session?.backendTokens.accessToken}`, 'Content-Type': 'application/json' },
  });

  if (response.status === 404) {
    return notFound();
  }

  const board: Board = await response.json();

  if (!board) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <SocketProvider boardId={parseInt(awaitedParams.boardId, 10)}>
        <Toolbar />
        <Canvas />
      </SocketProvider>
    </div>
  );
}
