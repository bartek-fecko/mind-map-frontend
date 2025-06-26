'use client';

import { useToolbarStore } from '../../store/useToolbarStore';
import { useHistoryStore } from '../../store/useHistoryStore';
import { useEffect, useState } from 'react';
import { useDrawing } from '../../hooks/useDrawing';
import EmojiPicker from '../EmojiPicker/EmojiPicker';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import GifSearchWrapper from '../GifSearch/GifSearchWrapper';
import { useGifStore } from '../../store/useGifStore';
import { ToolbarIcons as Icon } from './icons/ToolbarIcons';
import DrawingSettingsModal from './components/DrawingSettingsModal';
import { useAlertStore } from '@/app/store/useAlertStore';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useBoard } from '@/app/hooks/useBoard';

export default function Toolbar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const addAlert = useAlertStore((state) => state.addAlert);
  const tool = useToolbarStore((s) => s.tool);
  const setTool = useToolbarStore((s) => s.setTool);
  const undo = useHistoryStore((s) => s.undo);
  const redo = useHistoryStore((s) => s.redo);
  const undoStack = useHistoryStore((s) => s.undoStack);
  const redoStack = useHistoryStore((s) => s.redoStack);
  const isUndoStackEmpty = undoStack?.length === 0;
  const isRedoStackEmpty = redoStack?.length === 0;
  const { clearAllDrawings } = useDrawing();
  const gifSearchVisible = useGifStore((state) => state.gifSearchVisible);
  const toggleGifSearch = useGifStore((state) => state.toggleGifSearch);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { removeBoardAllContent } = useBoard();

  const clearBoard = () => {
    removeBoardAllContent();
    setShowClearConfirm(false);
  };

  useEffect(() => {
    const created = searchParams.get('boardCreated');
    if (created === 'true') {
      addAlert('success', 'Tablica została pomyślnie utworzona!');
      const params = new URLSearchParams(searchParams);
      params.delete('boardCreated');
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      router.replace(newUrl);
    }
  }, [searchParams, addAlert]);

  return (
    <>
      <ul className="fixed left-1/2 bottom-3 transform -translate-x-1/2 px-3 flex items-center bg-white bg-shadow-sm rounded border border-gray-200 z-50">
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
