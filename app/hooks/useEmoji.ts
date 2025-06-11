import { RefObject } from 'react';
import { useToolbarStore } from '../store/useToolbarStore';
import { useEmojiStore, EmojiItem } from '../store/useEmojiStore';
import { useSocket } from '../providers/SocketProvider';
import { v4 as uuidv4 } from 'uuid';

export function useEmoji(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const { selectedEmoji, setSelectedEmoji } = useToolbarStore();
  const addEmoji = useEmojiStore((s) => s.addEmoji);
  const setTool = useToolbarStore((s) => s.setTool);
  const { socket } = useSocket();

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedEmoji) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newEmoji: EmojiItem = { id: uuidv4(), x, y, emoji: selectedEmoji, width: 60, height: 60 };

    addEmoji(newEmoji);

    // // Wysyłaj do serwera (analogicznie do notatek)
    // socket.emit('emoji:add', newEmoji);

    setSelectedEmoji(null);
    setTool('none');
  };

  return { handleCanvasClick };
}
