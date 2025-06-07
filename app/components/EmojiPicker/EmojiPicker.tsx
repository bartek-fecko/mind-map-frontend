'use client';

import { useState } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { FaceSmileIcon } from '@heroicons/react/24/outline';
import { useToolbarStore } from '@/app/store/useToolbarStore';

type EmojiPickerProps = {
  buttonBaseClasses?: string;
  buttonHoverClasses?: string;
};

export default function EmojiPicker({ buttonBaseClasses, buttonHoverClasses }: EmojiPickerProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const setSelectedEmoji = useToolbarStore((state) => state.setSelectedEmoji);
  const setTool = useToolbarStore((s) => s.setTool);

  const handleEmojiSelect = (emoji: any) => {
    setTool('emoji');
    setSelectedEmoji(emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowEmojiPicker((prev) => !prev)}
        className={`${buttonBaseClasses} ${showEmojiPicker ? 'border-blue-500 bg-blue-100' : buttonHoverClasses}`}
        aria-pressed={showEmojiPicker}
      >
        <FaceSmileIcon className="w-6 h-6 text-gray-600" />
      </button>

      {showEmojiPicker && (
        <div className="absolute top-10 left-0 z-50">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" previewPosition="none" perLine={6} />
        </div>
      )}
    </div>
  );
}
