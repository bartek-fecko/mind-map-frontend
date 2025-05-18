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
import { useClearCanvas } from '../hooks/useClearCanvas';

export default function Toolbar() {
  const { setLineWidth, lineWidth } = useDrawingStore();
  const { tool, setTool } = useToolbarStore();
  const { undo, redo } = useHistoryStore();
  const { clearDrawings, clearAll } = useClearCanvas();

  return (
    <aside className="px-4 py-6 w-full max-w-[150px] bg-white shadow h-full space-y-6">
      <h2 className="text-xl font-bold">Toolbar</h2>

      <ul className="space-y-2">
        <li className="flex space-x-2">
          <button
            onClick={() => setTool('draw')}
            className={`cursor-pointer p-1 rounded-md flex items-center justify-center
              ${
                tool === 'draw'
                  ? 'border-2 border-blue-500 bg-blue-100'
                  : 'border border-transparent hover:border-gray-300'
              }`}
            aria-pressed={tool === 'draw'}
          >
            <PencilIcon className={`w-6 h-6 ${tool === 'draw' ? 'text-blue-600' : 'text-gray-600'}`} />
          </button>

          <button
            onClick={() => setTool('eraser')}
            className={`cursor-pointer p-1 rounded-md flex items-center justify-center
              ${
                tool === 'eraser'
                  ? 'border-2 border-blue-500 bg-blue-100'
                  : 'border border-transparent hover:border-gray-300'
              }`}
            aria-pressed={tool === 'eraser'}
            aria-label="gumka"
          >
            <BackspaceIcon className={`w-6 h-6 ${tool === 'eraser' ? 'text-blue-600' : 'text-gray-600'}`} />
          </button>

          <button
            onClick={() => clearDrawings()}
            className="p-1 border rounded-md hover:bg-gray-100 cursor-pointer flex items-center justify-center"
            aria-label="Clear Drawings"
            title="Wyczyść rysunki"
          >
            <TrashIcon className="w-6 h-6 text-red-600" />
          </button>
        </li>

        <li>
          <button
            onClick={() => setTool('note')}
            className={`cursor-pointer p-1 rounded-md flex items-center justify-start flex-1
              ${
                tool === 'note'
                  ? 'border-2 border-blue-500 bg-blue-100'
                  : 'border border-transparent hover:border-gray-300'
              }`}
            aria-pressed={tool === 'note'}
          >
            <ClipboardIcon className={`w-6 h-6 ${tool === 'note' ? 'text-blue-600' : 'text-gray-600'}`} />
          </button>
        </li>
      </ul>

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

        <div className="flex space-x-2 pt-4">
          <button onClick={undo} className="p-1 border rounded-md hover:bg-gray-100 cursor-pointer" aria-label="Undo">
            <ArrowUturnLeftIcon className="w-6 h-6 text-gray-700" />
          </button>

          <button onClick={redo} className="p-1 border rounded-md hover:bg-gray-100 cursor-pointer" aria-label="Redo">
            <ArrowUturnRightIcon className="w-6 h-6 text-gray-700" />
          </button>

          <button
            onClick={clearAll}
            className="p-1 border rounded-md hover:bg-gray-100 cursor-pointer"
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
