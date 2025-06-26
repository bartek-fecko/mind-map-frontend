'use client';

import { useModalStore } from '@/app/store/modalStore';
import ShareIcon from '../Icons/ShareIcon';
import { MouseEvent } from 'react';

interface ShareButtonProps {
  boardId: string;
  boardTitle: string;
}

const ShareButton = ({ boardId, boardTitle }: ShareButtonProps) => {
  const openModal = useModalStore((state) => state.openModal);

  function onShareClick(e: MouseEvent) {
    e.stopPropagation();
    openModal('shareBoard', { boardId, boardTitle });
  }

  return (
    <button
      className="h-10 px-[18px] flex items-center justify-center text-sm font-medium
    text-indigo-600 rounded-lg border border-indigo-600 gap-2 
    cursor-pointer hover:bg-purple-50"
      onClick={onShareClick}
    >
      <ShareIcon width={18} height={18} />
      Share
    </button>
  );
};

export default ShareButton;
