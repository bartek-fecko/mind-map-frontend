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

function CanvasComponent() {
  const localCanvasRef = useRef<HTMLCanvasElement>(null);
  const { notes } = useNoteStore();
  const { tool } = useToolbarStore();
  const { startDraw, draw, stopDraw } = useDrawing();
  const { handleCanvasClick } = useNotes(localCanvasRef);

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

  const cursorStyle = tool !== 'none' ? CURSOR_MAP[tool] : 'default';

  return (
    <div className="relative w-[1500px] h-[1200px]">
      <canvas
        id="canvas"
        ref={localCanvasRef}
        width={1500}
        height={1200}
        style={{ cursor: cursorStyle, position: 'absolute', top: 0, left: 0, zIndex: 2 }}
        onPointerDown={startDraw}
        onPointerMove={draw}
        onPointerUp={stopDraw}
        onPointerLeave={stopDraw}
        onClick={handleCanvasClick}
      />
      {notes.map((note) => (
        <NoteCard key={note.id} {...note} />
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
