import { useState, useRef, useEffect } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useToolbarStore } from '@/app/store/useToolbarStore';
import { ToolbarIcons as Icon } from '../Toolbar/icons/ToolbarIcons';

export default function EmojiPicker() {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const setSelectedEmoji = useToolbarStore((state) => state.setSelectedEmoji);
  const setTool = useToolbarStore((s) => s.setTool);
  const pickerRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEmojiSelect = (emoji: any) => {
    setTool('emoji');
    setSelectedEmoji(emoji.native);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div ref={pickerRef}>
      <Icon name="emoji" onClick={() => setShowEmojiPicker((prev) => !prev)} />

      {showEmojiPicker && (
        <div className="absolute bottom-11">
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            theme="light"
            previewPosition="none"
            perLine={6}
            position="top"
          />
        </div>
      )}
    </div>
  );
}
