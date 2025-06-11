'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useDraggableResizable } from '../../hooks/useDraggableResizable';

export interface DraggableElement {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Props {
  id: string;
  element: DraggableElement;
  onUpdate: (id: string, updates: Partial<DraggableElement>) => void;
  children: ReactNode;
  className?: string;
  disableInteractions?: boolean;
  minWidth?: number;
  minHeight?: number;
}

export default function ResizableCard({
  id,
  element,
  onUpdate,
  children,
  className,
  disableInteractions,
  minWidth = 190,
  minHeight = 160,
}: Props) {
  const [localElement, setLocalElement] = useState(element);

  useEffect(() => {
    let newWidth = element.width;
    let newHeight = element.height;

    if (typeof minWidth === 'number' && element.width < minWidth) {
      newWidth = minWidth;
    }

    if (typeof minHeight === 'number' && element.height < minHeight) {
      newHeight = minHeight;
    }

    if (newWidth !== element.width || newHeight !== element.height) {
      setLocalElement({ ...element, width: newWidth, height: newHeight });
    } else {
      setLocalElement(element);
    }
  }, [element, minWidth, minHeight]);

  const { ref, onDragStart, onResizeStart } = useDraggableResizable(
    id,
    localElement,
    (id, updates) => {
      const updated = { ...localElement, ...updates };
      setLocalElement(updated);
      onUpdate(id, updated);
    },
    minWidth,
    minHeight,
  );

  return (
    <div
      ref={ref}
      className={`absolute group ${className || ''}`}
      style={{
        left: `${localElement.x}px`,
        top: `${localElement.y}px`,
        width: `${localElement.width}px`,
        height: `${localElement.height}px`,
      }}
    >
      <div className="absolute top-0 left-0 w-full h-5 z-10 cursor-move" onMouseDown={onDragStart} />
      <div className="w-full h-full relative overflow-visible flex items-center justify-center">{children}</div>

      {!disableInteractions && (
        <>
          {/* Resize handles */}
          <div
            className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-20"
            style={{ top: '-6px', left: '-6px' }}
            onMouseDown={(e) => onResizeStart(e, 'top-left')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-ne-resize opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-20"
            style={{ top: '-6px', right: '-6px' }}
            onMouseDown={(e) => onResizeStart(e, 'top-right')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-sw-resize opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-20"
            style={{ bottom: '-6px', left: '-6px' }}
            onMouseDown={(e) => onResizeStart(e, 'bottom-left')}
          />
          <div
            className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-20"
            style={{ bottom: '-6px', right: '-6px' }}
            onMouseDown={(e) => onResizeStart(e, 'bottom-right')}
          />
        </>
      )}
    </div>
  );
}
