'use client';

import { useDrawingStore } from '../../store/useDrawingStore';
import { useToolbarStore } from '../../store/useToolbarStore';
import { useHistoryStore } from '../../store/useHistoryStore';
import { useNotes } from '../../hooks/useNotes';
import { useRef, useState } from 'react';
import { useDrawing } from '../../hooks/useDrawing';
import EmojiPicker from '../EmojiPicker/EmojiPicker';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import GifSearchWrapper from '../GifSearch/GifSearchWrapper';
import { useGifStore } from '../../store/useGifStore';

import styles from './Toolbar.module.css';
import { ToolbarIcons as Icon } from './icons/ToolbarIcons';
import DrawingSettingsModal from './components/DrawingSettingsModal';

export default function Toolbar() {
  const tool = useToolbarStore((s) => s.tool);
  const setTool = useToolbarStore((s) => s.setTool);
  const undo = useHistoryStore((s) => s.undo);
  const redo = useHistoryStore((s) => s.redo);
  const undoStack = useHistoryStore((s) => s.undoStack);
  const redoStack = useHistoryStore((s) => s.redoStack);

  const isUndoStackEmpty = undoStack?.length === 0;
  const isRedoStackEmpty = redoStack?.length === 0;

  const { clearAll, clearAllDrawings } = useDrawing();
  const { removeAllNotes } = useNotes(useRef(null));

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false); // Dodano: stan modala Settings
  const gifSearchVisible = useGifStore((state) => state.gifSearchVisible);
  const toggleGifSearch = useGifStore((state) => state.toggleGifSearch);

  const clearBoard = () => {
    clearAll();
    removeAllNotes();
    setShowClearConfirm(false);
  };

  return (
    <>
      <ul className={styles.list}>
        <Icon name="pencil" onClick={() => setTool('draw')} selected={tool === 'draw'} />
        <Icon name="eraser" onClick={() => setTool('eraser')} selected={tool === 'eraser'} />
        <Icon name="settings" onClick={() => setShowSettings(!showSettings)} />
        <Icon name="trashDrawings" onClick={() => clearAllDrawings()} />
        <Icon name="note" onClick={() => setTool('note')} selected={tool === 'note'} />
        <EmojiPicker />
        <Icon name="text" />
        <Icon name="circle" />
        <Icon name="gif" onClick={toggleGifSearch} />
        {showSettings && <DrawingSettingsModal onClose={() => setShowSettings(false)} />}
        <Icon name="prev" onClick={undo} disabled={isUndoStackEmpty} />
        <Icon name="redo" onClick={redo} disabled={isRedoStackEmpty} />
        <Icon name="clear" onClick={() => setShowClearConfirm(true)} />
      </ul>

      {showClearConfirm && (
        <ConfirmModal
          message="Czy na pewno chcesz wyczyścić cały board?"
          onConfirm={clearBoard}
          onCancel={() => setShowClearConfirm(false)}
          confirmText="Wyczyść"
          cancelText="Anuluj"
        />
      )}
      {gifSearchVisible && <GifSearchWrapper />}
    </>
  );
}
