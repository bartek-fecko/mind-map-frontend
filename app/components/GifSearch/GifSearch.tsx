'use client';

import { IGif } from '@giphy/js-types';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/app/utils/useDebounce';
import Image from 'next/image';
import { GifItem, useGifStore } from '@/app/store/useGifStore';
import { useSocket } from '@/app/providers/SocketProvider';
import { GifsSocketEvents } from '@/app/types/socketEvents';

const gf = new GiphyFetch('cvf9D37OPCF9dBsa0c1v8Be6E179I8Qg');

interface GiphySearchProps {
  onSelectGif?: (gif: GifItem) => void;
}

export default function GiphySearch({ onSelectGif }: GiphySearchProps) {
  const [query, setQuery] = useState('');
  const [gifs, setGifs] = useState<IGif[]>([]);
  const debouncedQuery = useDebounce(query, 300);
  const addGif = useGifStore((state) => state.addGif);
  const hideGifSearch = useGifStore((state) => state.hideGifSearch);
  const { socket } = useSocket();

  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      setGifs([]);
      return;
    }

    const fetchGifs = async () => {
      const { data } = await gf.search(debouncedQuery, { limit: 10 });
      setGifs(data);
    };

    fetchGifs();
  }, [debouncedQuery]);

  const handleAddGif = (gif: IGif) => {
    const createdGif = {
      id: `${gif.id}`,
      x: 100,
      y: 200,
      width: 100,
      height: 100,
      url: gif.images.fixed_width.url,
      alt: gif.title,
    };
    onSelectGif?.(createdGif);
    addGif(createdGif);
    socket.emit(GifsSocketEvents.ADD_GIF, { boardId: 'init', gif: createdGif });
    hideGifSearch();
  };

  return (
    <div className="max-w-md w-full bg-white p-4 rounded shadow-lg z-50">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Wyszukaj GIFs"
        className="border p-2 w-full rounded mb-4"
      />
      <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {gifs.map((gif) => (
          <Image
            unoptimized
            key={gif.id}
            src={gif.images.fixed_width.url}
            width={Number(gif.images.fixed_width.width)}
            height={Number(gif.images.fixed_width.height)}
            alt={gif.title}
            className="w-full h-auto rounded cursor-pointer shadow"
            onClick={() => handleAddGif(gif)}
          />
        ))}
      </div>
    </div>
  );
}
