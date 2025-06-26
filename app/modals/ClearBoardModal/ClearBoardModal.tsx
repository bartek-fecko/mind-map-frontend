'use client';

import Modal from '../Modal';
import Button from '@/app/components/Button/Button';

interface ClearBoardModalProps {
  onClose: () => void;
  clearBoard: () => void;
}

export default function ClearBoardModal({ onClose, clearBoard }: ClearBoardModalProps) {
  return (
    <Modal title="Potwierdzenie" size="sm" wrapperClassName="flex flex-col max-h-[450px]" onClose={onClose}>
      <p className="text-label-secondary text-sm">
        Czy napewno chcesz wyczyścić <strong>całą</strong> tablicę? Tego nie można cofnąć
      </p>
      <div className="flex justify-end gap-3 pt-3 mt-auto">
        <Button variant="secondary" onClick={onClose}>
          Anuluj
        </Button>
        <Button onClick={clearBoard}>Zapisz</Button>
      </div>
    </Modal>
  );
}
