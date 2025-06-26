'use client';

import Modal from '../Modal';
import { useAlertStore } from '@/app/store/useAlertStore';
import { fetchWithToken } from '@/lib/api';
import Button from '@/app/components/Button/Button';
import { useRouter } from 'next/navigation';

interface DeleteBoardModalProps {
  boardId: string;
  boardTitle: string;
  onClose: () => void;
}

export default function DeleteBoardModal({ boardId, boardTitle, onClose }: DeleteBoardModalProps) {
  const addAlert = useAlertStore((state) => state.addAlert);
  const router = useRouter();

  const handleSave = async () => {
    try {
      const response = await fetchWithToken(`/boards/${boardId}`, {
        method: 'DELETE',
      });

      if (response?.ok) {
        addAlert('success', 'Pomyślnie usunięto tablice');
        router.refresh();
      }
      if (!response?.ok) {
        const error = await response?.json();
        addAlert('error', `Wystąpił błąd: ${error?.message}`);
      }
    } catch (e) {
      addAlert('error', `Wystąpił błąd: ${e}`);
    }

    onClose();
  };

  return (
    <Modal
      title={`Usuń tablice ${boardTitle} `}
      size="sm"
      wrapperClassName="flex flex-col max-h-[450px]"
      onClose={onClose}
    >
      <p className="text-label-secondary text-sm">Czy napewno chcesz usunąc tą tablicę?</p>
      <div className="flex justify-end gap-3 pt-3 mt-auto">
        <Button variant="secondary" onClick={onClose}>
          Anuluj
        </Button>
        <Button onClick={handleSave}>Zapisz</Button>
      </div>
    </Modal>
  );
}
