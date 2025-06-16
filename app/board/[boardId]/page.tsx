import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { SocketProvider } from '@/app/providers/SocketProvider';
import Toolbar from '../../components/Toolbar/Toolbar';
import Canvas from '../Board';
import styles from './MindMap.module.css';
import { fetchApi } from '@/lib/api';

export default async function MindMap({ params }: { params: Promise<{ boardId: string }> }) {
  const cookieStore = await cookies();
  const awaitedParams = await params;
  const token = cookieStore.get('token')?.value;

  if (!token) {
    notFound();
  }

  const board = await fetchApi(`/boards/${awaitedParams.boardId}`);

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
