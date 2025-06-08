'use client';
import { memo, useEffect, useRef, useState } from 'react';
import { useDrawing } from '../hooks/useDrawing';
import { useNoteStore } from '../store/useNoteStore';
import NoteCard from '../components/NoteCard/NoteCard';
import { useToolbarStore } from '../store/useToolbarStore';
import { useNotes } from '../hooks/useNotes';
import { useNoteSocketListeners } from '../hooks/useNoteSocketListeners';
import { CURSOR_MAP } from '../components/CursorOverlay/constants';
import { useDrawingStore } from '../store/useDrawingStore';
import { useEmoji } from '../hooks/useEmoji';
import { useEmojiStore } from '../store/useEmojiStore';
import EmojiIcon from '../components/EmojiIcon/EmojiIcon';
import ResizableCard from '../components/ResizableCard/ResizableCard';
import { useDrawingSocketListeners } from '../hooks/useDrawingSocketListeners';

function CanvasComponent() {
  const localCanvasRef = useRef<HTMLCanvasElement>(null);
  const { notes, editModeNoteId } = useNoteStore();
  const { emojis } = useEmojiStore();
  const { tool } = useToolbarStore();
  const { startDraw, draw, stopDraw } = useDrawing();

  const { updateNote } = useNotes(localCanvasRef);
  const { handleCanvasClick: handleNoteClick } = useNotes(localCanvasRef);
  const { handleCanvasClick: handleEmojiClick } = useEmoji(localCanvasRef);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleEmojiClick(e);
    handleNoteClick(e);
  };

  useEffect(() => {
    if (localCanvasRef.current) {
      const store = useDrawingStore.getState();
      store.setCanvasRef(localCanvasRef.current);
      if (!store.workerRef) {
        store.initWorker();
      }
    }
  }, []);

  useNoteSocketListeners();
  useDrawingSocketListeners();

  const cursorStyle = tool !== 'none' ? CURSOR_MAP[tool] : 'default';

  return (
    <div className={`relative min-w-[2000px] min-h-[1200px] z-2`}>
      <canvas
        id="canvas"
        ref={localCanvasRef}
        width={2000}
        height={1200}
        style={{ cursor: cursorStyle, position: 'absolute', top: 0, left: 0 }}
        onPointerDown={startDraw}
        onPointerMove={draw}
        onPointerUp={stopDraw}
        onPointerLeave={stopDraw}
        onClick={handleCanvasClick}
      />
      {notes.map((note) => (
        <ResizableCard
          key={note.id}
          className="z-3"
          id={note.id}
          element={{
            x: parseInt(note.x),
            y: parseInt(note.y),
            width: note.width || 200,
            height: note.height || 150,
          }}
          minWidth={editModeNoteId === note.id ? 600 : undefined}
          minHeight={editModeNoteId === note.id ? 400 : undefined}
          onUpdate={(id, updates) => {
            if (editModeNoteId === note.id) return;
            updateNote({
              ...updates,
              id,
              x: updates.x?.toString(),
              y: updates.y?.toString(),
              width: updates.width,
              height: updates.height,
            });
          }}
        >
          <NoteCard {...note} />
        </ResizableCard>
      ))}
      {emojis.map((emoji) => (
        <EmojiIcon key={emoji.id} {...emoji} />
      ))}
    </div>
  );
}

function CanvasWrapper() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const waitFonts = async () => {
      await document.fonts.ready;
      setIsReady(true);
    };

    if (document.readyState === 'complete') {
      waitFonts();
    } else {
      window.addEventListener('load', waitFonts);
      return () => window.removeEventListener('load', waitFonts);
    }
  }, []);

  if (!isReady || typeof window === 'undefined') {
    return (
      <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-600 select-none">
        Ładowanie...
      </div>
    );
  }

  return <CanvasComponent />;
}

export default memo(CanvasWrapper);
