'use client';

import { useEffect, useRef } from 'react';
import GifSearch from './GifSearch';
import { GifItem, useGifStore } from '@/app/store/useGifStore';

export default function GifSearchWrapper({ onSelectGif }: { onSelectGif?: (gif: GifItem) => void }) {
  const visible = useGifStore((state) => state.gifSearchVisible);
  const hide = useGifStore((state) => state.hideGifSearch);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('input') &&
        !(event.target as HTMLElement).closest('img')
      ) {
        hide();
      }
    }

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, hide]);

  if (!visible) return null;

  return (
    <div ref={wrapperRef} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
      <GifSearch
        onSelectGif={(gif: GifItem) => {
          onSelectGif?.(gif);
          hide();
        }}
      />
    </div>
  );
}
