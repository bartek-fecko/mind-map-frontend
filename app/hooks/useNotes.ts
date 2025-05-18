import { RefObject } from 'react';
import { useNoteStore } from '../store/useNoteStore';
import { useToolbarStore } from '../store/useToolbarStore';
import { useHistoryStore } from '../store/useHistoryStore';

export function useNotes(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const { tool, setTool } = useToolbarStore();
  const { addNote, removeNote, restoreNote } = useNoteStore();

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool !== 'note') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newNote = addNote({ x, y, content: '' });
    useHistoryStore.getState().pushAction({
      type: 'note',
      payload: newNote,
      undo: () => removeNote(newNote.id),
      redo: () => restoreNote(newNote.id),
    });
    setTool(null);
  };

  return { handleCanvasClick };
}
