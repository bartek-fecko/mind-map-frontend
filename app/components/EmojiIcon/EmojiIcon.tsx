import { EmojiItem } from '@/app/store/useEmojiStore';

interface Props {
  emoji: EmojiItem;
  containerSize: { width: number; height: number };
}

export default function EmojiIcon({ emoji, containerSize }: Props) {
  const size = Math.min(containerSize.width, containerSize.height) / 2;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <span
        style={{
          fontSize: `${size}px`,
          lineHeight: 1,
          display: 'inline-block',
          overflow: 'visible',
        }}
      >
        {emoji.emoji}
      </span>
    </div>
  );
}
