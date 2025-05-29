'use client';

import {
  ClipboardIcon,
  PencilIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  TrashIcon,
  BackspaceIcon,
} from '@heroicons/react/24/outline';
import { useDrawingStore } from '../store/useDrawingStore';
import { useToolbarStore } from '../store/useToolbarStore';
import ColorPicker from '../components/ColorPicker/ColorPicker';
import { useHistoryStore } from '../store/useHistoryStore';
import { useNotes } from '../hooks/useNotes';
import { useRef } from 'react';
import { useDrawing } from '../hooks/useDrawing';

export default function Toolbar() {
  const setLineWidth = useDrawingStore((s) => s.setLineWidth);
  const lineWidth = useDrawingStore((s) => s.lineWidth);
  const tool = useToolbarStore((s) => s.tool);
  const setTool = useToolbarStore((s) => s.setTool);
  const undo = useHistoryStore((s) => s.undo);
  const redo = useHistoryStore((s) => s.redo);
  const { clearAll, clearAllDrawings } = useDrawing();
  const { removeAllNotes } = useNotes(useRef(null));

  const clearBoard = () => {
    clearAll();
    removeAllNotes();
  };

  const buttonBaseClasses =
    'cursor-pointer p-1 rounded-md flex items-center justify-center border-2 border-transparent';

  const buttonHoverClasses = 'hover:border-gray-300';

  return (
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
            className={`${buttonBaseClasses} ${tool === 'eraser' ? 'border-blue-500 bg-blue-100' : buttonHoverClasses}`}
            aria-pressed={tool === 'eraser'}
            aria-label="gumka"
          >
            <BackspaceIcon className={`w-6 h-6 ${tool === 'eraser' ? 'text-blue-600' : 'text-gray-600'}`} />
          </button>

          <button
            onClick={() => clearAllDrawings()}
            className="p-1 rounded-md hover:bg-gray-100 cursor-pointer flex items-center justify-center border-2 border-transparent hover:border-gray-300"
            aria-label="Clear Drawings"
            title="Wyczyść rysunki"
          >
            <TrashIcon className="w-6 h-6 text-red-600" />
          </button>
        </li>

        {/* Notes */}
        <li>
          <button
            onClick={() => setTool('note')}
            className={`${buttonBaseClasses} flex justify-start flex-1 ${
              tool === 'note' ? 'border-blue-500 bg-blue-100' : buttonHoverClasses
            }`}
            aria-pressed={tool === 'note'}
          >
            <ClipboardIcon className={`w-6 h-6 ${tool === 'note' ? 'text-blue-600' : 'text-gray-600'}`} />
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
          <input
            id="lineWidth"
            type="number"
            min="1"
            max="50"
            defaultValue={lineWidth}
            className="w-full border rounded-md px-2 py-1"
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
          />
        </div>

        {/* History */}
        <div className="flex space-x-2 pt-4">
          <button
            onClick={undo}
            className="p-1 border-2 border-transparent rounded-md hover:bg-gray-100 cursor-pointer hover:border-gray-300"
            aria-label="Undo"
          >
            <ArrowUturnLeftIcon className="w-6 h-6 text-gray-700" />
          </button>

          <button
            onClick={redo}
            className="p-1 border-2 border-transparent rounded-md hover:bg-gray-100 cursor-pointer hover:border-gray-300"
            aria-label="Redo"
          >
            <ArrowUturnRightIcon className="w-6 h-6 text-gray-700" />
          </button>

          <button
            onClick={clearBoard}
            className="p-1 border-2 border-transparent rounded-md hover:bg-gray-100 cursor-pointer hover:border-gray-300"
            aria-label="Clear All"
            title="Wyczyść wszystko"
          >
            <TrashIcon className="w-6 h-6 text-red-600" />
          </button>
        </div>
      </div>
    </aside>
  );
}
