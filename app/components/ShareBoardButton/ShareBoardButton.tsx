'use client';

import { useModalStore } from '@/app/store/modalStore';
import ShareIcon from '../Icons/ShareIcon';
import { MouseEvent } from 'react';

interface ShareBoardButtonProps {
  id: string;
  title: string;
}

export default function ShareBoardButton({ id, title }: ShareBoardButtonProps) {
  const openModal = useModalStore((state) => state.openModal);

  function onShareClick(e: MouseEvent) {
    e.stopPropagation();
    openModal('shareBoard', { id, title });
  }

  return (
    <button className="cursor-pointer" onClick={onShareClick}>
      <ShareIcon />
    </button>
  );
}
