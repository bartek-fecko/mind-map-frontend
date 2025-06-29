'use client';
import { memo, useEffect, useRef, useState } from 'react';
import { useDrawing } from '../../../hooks/useDrawing';
import { useNoteStore } from '../../../store/useNoteStore';
import NoteCard from '../../../components/NoteCard/NoteCard';
import { useToolbarStore } from '../../../store/useToolbarStore';
import { useNotes } from '../../../hooks/useNotes';
import { useNoteSocketListeners } from '../../../hooks/useNoteSocketListeners';
import { CURSOR_MAP } from '../../../components/CursorOverlay/constants';
import { useDrawingStore } from '../../../store/useDrawingStore';
import { useEmoji } from '../../../hooks/useEmoji';
import { useEmojiStore } from '../../../store/useEmojiStore';
import EmojiIcon from '../../../components/EmojiIcon/EmojiIcon';
import ResizableCard from '../../../components/ResizableCard/ResizableCard';
import { useDrawingSocketListeners } from '../../../hooks/useDrawingSocketListeners';
import { useGifStore } from '../../../store/useGifStore';
import Image from 'next/image';
import { useGifSocketListeners } from '../../../hooks/useGifSocketListeners';
import styles from './Board.module.css';
import Loader from '../../../components/Loader/Loader';
import { useGif } from '@/app/hooks/useGif';

function BoardComponent() {
  const localCanvasRef = useRef<HTMLCanvasElement>(null);
  const emojis = useEmojiStore((s) => s.emojis);
  const updateEmoji = useEmojiStore((s) => s.updateEmoji);
  const gifs = useGifStore((s) => s.gifs);
  const tool = useToolbarStore((s) => s.tool);
  const { boardId, startDraw, draw, stopDraw, clearCanvas } = useDrawing();
  const clearStrokes = useDrawingStore((state) => state.clearStrokes);
  const clearNotes = useNoteStore((state) => state.removeAllNotes);
  const notes = useNoteStore((state) => state.notes);
  const editModeNoteId = useNoteStore((state) => state.editModeNoteId);
  const { updateNote } = useNotes(localCanvasRef);
  const { handleCanvasClick: handleNoteClick } = useNotes(localCanvasRef);
  const { handleCanvasClick: handleEmojiClick } = useEmoji(localCanvasRef);
  const { updateGif } = useGif();
  const removeAllGifs = useGifStore((state) => state.removeAllGifs);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleEmojiClick(e);
    handleNoteClick(e);
  };

  useEffect(() => {
    if (localCanvasRef.current) {
      const store = useDrawingStore.getState();
      store.setCanvasRef(localCanvasRef.current);
      store.initWorker();
    }
    return () => {
      clearNotes();
      clearCanvas();
      clearStrokes();
      removeAllGifs();
    };
  }, [boardId]);

  useNoteSocketListeners();
  useDrawingSocketListeners();
  useGifSocketListeners();

  const cursorStyle = tool !== 'none' ? CURSOR_MAP[tool] : 'default';

  return (
    <div className={styles.board}>
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
          minWidth={editModeNoteId === note.id ? 990 : 160}
          minHeight={editModeNoteId === note.id ? 600 : 160}
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
        <ResizableCard
          key={emoji.id}
          id={emoji.id}
          element={{
            x: emoji.x,
            y: emoji.y,
            width: emoji.width,
            height: emoji.height,
          }}
          minWidth={60}
          minHeight={60}
          onUpdate={(id, updates) => {
            updateEmoji(id, {
              ...updates,
              x: updates.x ?? emoji.x,
              y: updates.y ?? emoji.y,
              width: updates.width ?? emoji.width,
              height: updates.height ?? emoji.height,
            });
          }}
        >
          <EmojiIcon emoji={emoji} containerSize={{ width: emoji.width, height: emoji.height }} />
        </ResizableCard>
      ))}
      {gifs.map((gif) => (
        <ResizableCard
          key={gif.id}
          id={`${gif.id}`}
          onUpdate={(id, updates) => {
            updateGif({ id, ...updates });
          }}
          element={{ x: gif.x, y: gif.y, width: gif.width, height: gif.height }}
        >
          <Image
            unoptimized
            src={gif.url}
            alt={gif.alt}
            fill
            style={{ objectFit: 'contain' }}
            className="cursor-pointer"
          />
        </ResizableCard>
      ))}
    </div>
  );
}

function BoardWrapper() {
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
    return <Loader />;
  }

  return <BoardComponent />;
}

export default memo(BoardWrapper);
