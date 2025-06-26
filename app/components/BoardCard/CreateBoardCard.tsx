'use client';

import { useModalStore } from '@/app/store/modalStore';
import { PlusIcon } from 'lucide-react';

export default function CreateBoardCard() {
  const openModal = useModalStore((state) => state.openModal);

  const handleOpen = () => {
    openModal('createBoard');
  };

  return (
    <button
      className="rounded-lg bg-white shadow hover:shadow-lg transition p-4
     flex flex-col gap-2 items-center cursor-pointer pt-[52px] pb-[75px]
     shadow-[0px_0px_1px_#171a1f12,0px_0px_2px_#171a1f1F]"
      onClick={handleOpen}
    >
      <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl bg-[#F3F4F6FF]">
        <PlusIcon />
      </div>
      <h3 className="text-[20px] font-semibold text-label-secondary">Utwórz nową tablicę</h3>
    </button>
  );
}
