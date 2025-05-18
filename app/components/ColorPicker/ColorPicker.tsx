'use client';
import { useDrawingStore } from '../../store/useDrawingStore';
import { useEffect, useState } from 'react';

export default function ColorPicker() {
  const { setStrokeColor } = useDrawingStore();
  const [color, setColor] = useState('#000000');

  useEffect(() => {
    const handler = setTimeout(() => {
      setStrokeColor(color);
    }, 1000);

    return () => clearTimeout(handler);
  }, [color, setStrokeColor]);

  return (
    <div>
      <label htmlFor="stroke" className="text-sm font-medium text-gray-700 block mb-1">
        Stroke Color
      </label>
      <input
        id="stroke"
        type="color"
        className="w-full h-10 border rounded-md"
        onChange={(e) => setColor(e.target.value)}
      />
    </div>
  );
}
