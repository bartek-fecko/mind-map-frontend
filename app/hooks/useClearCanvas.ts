import { useDrawingStore } from '../store/useDrawingStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { useNoteStore } from '../store/useNoteStore';

export function useClearCanvas() {
  const { canvasRef, ctxRef } = useDrawingStore();
  const { pushAction, clear } = useHistoryStore();
  const { setNotes } = useNoteStore();

  const clearDrawings = () => {
    if (!canvasRef || !ctxRef) return;

    const before = ctxRef.getImageData(0, 0, canvasRef.width, canvasRef.height);

    let isEmpty = true;
    for (let i = 3; i < before.data.length; i += 4) {
      if (before.data[i] !== 0) {
        isEmpty = false;
        break;
      }
    }
    if (isEmpty) return;

    ctxRef.clearRect(0, 0, canvasRef.width, canvasRef.height);

    const after = ctxRef.getImageData(0, 0, canvasRef.width, canvasRef.height);

    pushAction({
      type: 'clear',
      undo: () => ctxRef.putImageData(before, 0, 0),
      redo: () => ctxRef.putImageData(after, 0, 0),
    });
  };

  const clearAll = () => {
    if (!canvasRef || !ctxRef) return;

    const ctx = ctxRef;
    const canvas = canvasRef;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setNotes([]);
    clear();
  };

  return { clearDrawings, clearAll };
}
