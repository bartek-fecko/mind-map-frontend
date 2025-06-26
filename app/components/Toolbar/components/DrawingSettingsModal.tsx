'use client';

import { useEffect, useRef } from 'react';
import { useDrawingStore } from '@/app/store/useDrawingStore';
import ColorPicker from '../../ColorPicker/ColorPicker';

type DrawingSettingsModalProps = {
  onClose: () => void;
};

export default function DrawingSettingsModal({ onClose }: DrawingSettingsModalProps) {
  const setLineWidth = useDrawingStore((s) => s.setLineWidth);
  const lineWidth = useDrawingStore((s) => s.lineWidth);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={modalRef} className="absolute bottom-11 bg-white bg-shadow-lg rounded-xl p-4 z-50">
      <div className="mb-4">
        <ColorPicker />
      </div>
      <div>
        <label htmlFor="lineWidth" className="block text-sm font-medium text-gray-700 mb-1">
          Line Width
        </label>
        <div className="flex items-center space-x-2">
          <input
            id="lineWidth"
            type="range"
            min={3}
            max={10}
            value={lineWidth}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
          />
          <span className="w-8 text-center text-gray-700 font-medium">{lineWidth}</span>
        </div>
      </div>
    </div>
  );
}
