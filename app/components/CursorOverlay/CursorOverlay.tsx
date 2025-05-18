import { useEffect, useState } from 'react';
import { useToolbarStore } from '../../store/useToolbarStore';
import { useDrawingStore } from '../../store/useDrawingStore';

export function CursorOverlay() {
  const { tool } = useToolbarStore();
  const { lineWidth } = useDrawingStore();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const calculatedLineWidth = tool === 'eraser' ? lineWidth * 2 : lineWidth;

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  if (tool !== 'draw' && tool != 'eraser') return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: pos.y - calculatedLineWidth / 2,
        left: pos.x - calculatedLineWidth / 2,
        width: calculatedLineWidth,
        height: calculatedLineWidth,
        backgroundColor: 'black',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0.5,
      }}
    />
  );
}
