import { useRef } from 'react';

interface DraggableElement {
  x: number;
  y: number;
  width: number;
  height: number;
}

type ResizeDirection = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export const useDraggableResizable = (
  id: string,
  element: DraggableElement | undefined,
  onUpdate: (id: string, updates: Partial<DraggableElement>) => void,
  minWidth: number | null,
  minHeight: number | null,
) => {
  const ref = useRef<HTMLDivElement>(null);

  const dragOffset = useRef({ x: 0, y: 0 });
  const latest = useRef<Partial<DraggableElement>>({});
  const resizeStart = useRef({ x: 0, y: 0 });
  const resizeInitial = useRef<DraggableElement | null>(null);
  const resizeDirection = useRef<ResizeDirection | null>(null);

  const onDragStart = (e: React.MouseEvent) => {
    if (!element || !ref.current) return;
    e.preventDefault();
    e.stopPropagation();

    dragOffset.current = {
      x: e.clientX - element.x,
      y: e.clientY - element.y,
    };

    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', onDragEnd);
  };

  const onDrag = (e: MouseEvent) => {
    const newX = e.clientX - dragOffset.current.x;
    const newY = e.clientY - dragOffset.current.y;

    if (ref.current) {
      ref.current.style.left = `${newX}px`;
      ref.current.style.top = `${newY}px`;
    }

    latest.current = { x: newX, y: newY };
  };

  const onDragEnd = () => {
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', onDragEnd);

    if (!element) return;

    const { x, y } = latest.current;
    const width = latest.current.width ?? element.width;
    const height = latest.current.height ?? element.height;

    if (x != null && y != null) {
      onUpdate(id, { x, y, width, height });
    }

    latest.current = {};
  };

  const onResizeStart = (e: React.MouseEvent, direction: ResizeDirection) => {
    if (!element || !ref.current) return;
    e.preventDefault();
    e.stopPropagation();

    resizeStart.current = { x: e.clientX, y: e.clientY };

    resizeInitial.current = {
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
    };

    resizeDirection.current = direction;

    window.addEventListener('mousemove', onResize);
    window.addEventListener('mouseup', onResizeEnd);
  };

  const onResize = (e: MouseEvent) => {
    if (!resizeInitial.current || !resizeDirection.current) return;

    const dx = e.clientX - resizeStart.current.x;
    const dy = e.clientY - resizeStart.current.y;

    let { x, y, width, height } = resizeInitial.current;
console.log(x, y, width);

    switch (resizeDirection.current) {
      case 'top-left':
        x += dx;
        y += dy;
        width -= dx;
        height -= dy;
        break;
      case 'top-right':
        y += dy;
        width += dx;
        height -= dy;
        break;
      case 'bottom-left':
        x += dx;
        width -= dx;
        height += dy;
        break;
      case 'bottom-right':
        width += dx;
        height += dy;
        break;
    }

    width = Math.max(minWidth || 0, width);
    height = Math.max(minHeight || 0, height);

    if (ref.current) {
      ref.current.style.left = `${x}px`;
      ref.current.style.top = `${y}px`;
      ref.current.style.width = `${width}px`;
      ref.current.style.height = `${height}px`;
    }

    latest.current = { x, y, width, height };
  };

  const onResizeEnd = () => {
    window.removeEventListener('mousemove', onResize);
    window.removeEventListener('mouseup', onResizeEnd);

    if (
      latest.current.x != null ||
      latest.current.y != null ||
      latest.current.width != null ||
      latest.current.height != null
    ) {
      onUpdate(id, { ...latest.current });
    }

    latest.current = {};
    resizeDirection.current = null;
  };

  return {
    ref,
    onDragStart,
    onResizeStart,
  };
};
