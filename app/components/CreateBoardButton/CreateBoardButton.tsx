'use client';

import { useModalStore } from '@/app/store/modalStore';
import { PlusIcon } from 'lucide-react';
import Button from '../Button/Button';

export default function CreateBoardButton() {
  const openModal = useModalStore((state) => state.openModal);

  const handleOpen = () => {
    openModal('createBoard');
  };

  return (
    <Button onClick={handleOpen}>
      <PlusIcon size={14} className="mr-1" /> Utwórz tablicę
    </Button>
  );
}
