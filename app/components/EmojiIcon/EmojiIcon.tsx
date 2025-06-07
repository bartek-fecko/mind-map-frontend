import { EmojiItem } from '@/app/store/useEmojiStore';

export default function EmojiIcon({ id, x, y, emoji }: EmojiItem) {
  return (
    <div
      className="absolute text-4xl"
      style={{ top: parseInt(y), left: parseInt(x) }}
      contentEditable
      suppressContentEditableWarning
    >
      {emoji}
    </div>
  );
}
