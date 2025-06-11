import { SocketProvider } from '@/app/providers/SocketProvider';
import Toolbar from '../Toolbar';
import Canvas from '../Canvas';

interface MindMapProps {
  params: Promise<{ boardId: string }>;
}

export default async function MindMap({ params }: MindMapProps) {
  const awaitedParams = await params;

  return (
    <div className="flex flex-row h-screen bg-gray-100">
      <SocketProvider boardId={parseInt(awaitedParams.boardId)}>
        <div className="border-r border-gray-300 bg-white">
          <Toolbar />
        </div>

        <div className="flex-1 overflow-auto bg-gray-100">
          <div
            className={`min-w-[2000px] min-h-[1200px] flex items-center`}
            style={{
              backgroundColor: '#f3f4f6',
              backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          >
            <Canvas />
          </div>
        </div>
      </SocketProvider>
    </div>
  );
}
