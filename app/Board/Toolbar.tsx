'use client';

import {
  ClipboardIcon,
  PencilIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  TrashIcon,
  BackspaceIcon,
  GifIcon,
} from '@heroicons/react/24/outline';
import { useDrawingStore } from '../store/useDrawingStore';
import { useToolbarStore } from '../store/useToolbarStore';
import ColorPicker from '../components/ColorPicker/ColorPicker';
import { useHistoryStore } from '../store/useHistoryStore';
import { useNotes } from '../hooks/useNotes';
import { useRef, useState } from 'react';
import { useDrawing } from '../hooks/useDrawing';
import EmojiPicker from '../components/EmojiPicker/EmojiPicker';
import ConfirmModal from '../components/ConfirmModal/ConfirmModal';
import GifSearchWrapper from '../components/GifSearch/GifSearchWrapper';
import { useGifStore } from '../store/useGifStore';

export default function Toolbar() {
  const setLineWidth = useDrawingStore((s) => s.setLineWidth);
  const lineWidth = useDrawingStore((s) => s.lineWidth);
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
  const gifSearchVisible = useGifStore((state) => state.gifSearchVisible);
  const toggleGifSearch = useGifStore((state) => state.toggleGifSearch);

  const clearBoard = () => {
    clearAll();
    removeAllNotes();
    setShowClearConfirm(false);
  };

  const buttonBaseClasses =
    'cursor-pointer p-1 rounded-md flex items-center justify-center border-2 border-transparent';

  const buttonHoverClasses = 'hover:border-gray-300';

  return (
    <>
      <aside className="px-4 py-6 w-full max-w-[150px] bg-white shadow h-full space-y-6">
        <h2 className="text-xl font-bold">Toolbar</h2>

        <ul className="space-y-2">
          {/* Drawing */}
          <li className="flex space-x-2">
            <button
              onClick={() => setTool('draw')}
              className={`${buttonBaseClasses} ${tool === 'draw' ? 'border-blue-500 bg-blue-100' : buttonHoverClasses}`}
              aria-pressed={tool === 'draw'}
            >
              <PencilIcon className={`w-6 h-6 ${tool === 'draw' ? 'text-blue-600' : 'text-gray-600'}`} />
            </button>

            <button
              onClick={() => setTool('eraser')}
              className={`${buttonBaseClasses} ${
                tool === 'eraser' ? 'border-blue-500 bg-blue-100' : buttonHoverClasses
              }`}
              aria-pressed={tool === 'eraser'}
            >
              <BackspaceIcon className={`w-6 h-6 ${tool === 'eraser' ? 'text-blue-600' : 'text-gray-600'}`} />
            </button>

            <button
              onClick={() => clearAllDrawings()}
              className="p-1 rounded-md hover:bg-gray-100 flex items-center justify-center border-2 border-transparent hover:border-gray-300"
            >
              <TrashIcon className="w-6 h-6 text-red-600" />
            </button>
          </li>

          {/* Notes */}
          <li className="flex space-x-2">
            <button
              onClick={() => setTool('note')}
              className={`${buttonBaseClasses} ${tool === 'note' ? 'border-blue-500 bg-blue-100' : buttonHoverClasses}`}
              aria-pressed={tool === 'note'}
            >
              <ClipboardIcon className={`w-6 h-6 ${tool === 'note' ? 'text-blue-600' : 'text-gray-600'}`} />
            </button>

            {/*  EmojiPicker */}
            <EmojiPicker buttonBaseClasses={buttonBaseClasses} buttonHoverClasses={buttonHoverClasses} />

            {/* GIFS */}
            <button
              onClick={toggleGifSearch}
              className={`${buttonBaseClasses} ${
                gifSearchVisible ? 'border-blue-500 bg-blue-100' : buttonHoverClasses
              }`}
              aria-pressed={gifSearchVisible}
              title="Search GIFs"
            >
              <GifIcon className={`w-6 h-6 ${gifSearchVisible ? 'text-blue-600' : 'text-gray-600'}`} />
            </button>
          </li>
        </ul>

        {/* Strokes */}
        <div className="space-y-4">
          <ColorPicker />

          <div>
            <label htmlFor="lineWidth" className="text-sm font-medium text-gray-700 block mb-1">
              Line Width
            </label>
            <div className="flex items-center space-x-3">
              <input
                id="lineWidth"
                type="range"
                min="3"
                max="10"
                value={lineWidth}
                className="w-full cursor-pointer"
                onChange={(e) => setLineWidth(parseInt(e.target.value))}
              />
              <span className="w-8 text-center text-gray-700 font-medium">{lineWidth}</span>
            </div>
          </div>

          {/* History */}
          <div className="flex space-x-2 pt-4">
            <button
              onClick={undo}
              disabled={isUndoStackEmpty}
              className={`p-1 border-2 border-transparent rounded-md ${
                isUndoStackEmpty
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-100 hover:border-gray-300 cursor-pointer'
              }`}
            >
              <ArrowUturnLeftIcon className="w-6 h-6 text-gray-700" />
            </button>

            <button
              onClick={redo}
              disabled={isRedoStackEmpty}
              className={`p-1 border-2 border-transparent rounded-md ${
                isRedoStackEmpty
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-100 hover:border-gray-300 cursor-pointer'
              }`}
            >
              <ArrowUturnRightIcon className="w-6 h-6 text-gray-700" />
            </button>

            <button
              onClick={() => setShowClearConfirm(true)}
              className="p-1 border-2 border-transparent rounded-md hover:bg-gray-100 hover:border-gray-300 cursor-pointer"
            >
              <TrashIcon className="w-6 h-6 text-red-600" />
            </button>
          </div>
        </div>
      </aside>

      {showClearConfirm && (
        <ConfirmModal
          message="Czy na pewno chcesz wyczyścić cały board?"
          onConfirm={clearBoard}
          onCancel={() => setShowClearConfirm(false)}
          confirmText="Wyczyść"
          cancelText="Anuluj"
        />
      )}

      {gifSearchVisible && (
        <GifSearchWrapper
          onSelectGif={(gif) => {
            console.log('Wybrano GIF:', gif);
            // tutaj logika po wyborze
          }}
        />
      )}
    </>
  );
}
