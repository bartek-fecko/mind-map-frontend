/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useModalStore } from '@/app/store/modalStore';
import dynamic from 'next/dynamic';

const ShareBoardModal = dynamic(() => import('./ShareBoardModal/ShareBoardModal'), { ssr: false });
const CreateBoardModal = dynamic(() => import('./CreateBoardModal/CreateBoardModal'), { ssr: false });
const DeleteBoardModal = dynamic(() => import('./DeleteBoardModal/DeleteBoardModal'), { ssr: false });

export default function ModalManager() {
  const { modalType, modalProps, closeModal } = useModalStore();

  if (!modalType) return null;

  switch (modalType) {
    case 'createBoard':
      return <CreateBoardModal {...(modalProps as any)} onClose={closeModal} />;
    case 'shareBoard':
      return <ShareBoardModal {...(modalProps as any)} onClose={closeModal} />;
    case 'deleteBoard':
      return <DeleteBoardModal {...(modalProps as any)} onClose={closeModal} />;

    default:
      return null;
  }
}
