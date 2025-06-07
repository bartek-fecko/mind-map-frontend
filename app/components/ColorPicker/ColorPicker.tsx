'use client';
import { useEffect, useState } from 'react';
import { useDrawingStore } from '../../store/useDrawingStore';
import { useDebounce } from '../../utils/useDebounce';

export default function ColorPicker() {
  const { setStrokeColor } = useDrawingStore();
  const [color, setColor] = useState('#000000');
  const debouncedColor = useDebounce(color, 300);

  useEffect(() => {
    setStrokeColor(debouncedColor);
  }, [debouncedColor, setStrokeColor]);

  return (
    <div>
      <label htmlFor="stroke" className="text-sm font-medium text-gray-700 block mb-1">
        Stroke Color
      </label>
      <input
        id="stroke"
        type="color"
        className="w-full h-10 border rounded-md cursor-pointer"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
    </div>
  );
}
