'use client';

import { useModalStore } from '@/app/store/modalStore';
import { Trash2 } from 'lucide-react';

interface DeleteBoardButtonProps {
  id: string;
  title: string;
}

export default function DeleteBoardButton({ id, title }: DeleteBoardButtonProps) {
  const openModal = useModalStore((state) => state.openModal);

  const handleOpen = () => {
    openModal('deleteBoard', { boardId: id, boardTitle: title });
  };

  return (
    <button onClick={handleOpen}>
      <Trash2 size={18} className="mr-2 cursor-pointer" />
    </button>
  );
}
