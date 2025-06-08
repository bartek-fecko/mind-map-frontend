'use client';

import { MouseEvent, useRef, useState } from 'react';
import NoteEditor from './NoteEditor';
import { useNotes } from '@/app/hooks/useNotes';
import { useNoteStore } from '@/app/store/useNoteStore';
import { useToolbarStore } from '@/app/store/useToolbarStore';
import ConfirmModal from '../ConfirmModal/ConfirmModal';

type Props = {
  id: string;
  x: string;
  y: string;
  content: string;
};

export default function NoteCard({ id, content }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { updateNote, removeNote } = useNotes(useRef(null));
  const { editModeNoteId, setEditModeNoteId } = useNoteStore();
  const isEditMode = editModeNoteId === id;
  const setTool = useToolbarStore((s) => s.setTool);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEditClicked = (e: MouseEvent) => {
    e.stopPropagation();
    setEditModeNoteId(id);
    setTool('none');
  };

  const handleDeleteClicked = (e: MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    removeNote(id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleSave = (newContent: string) => {
    updateNote({ id, content: newContent });
    setEditModeNoteId(null);
  };

  const handleCancel = () => {
    setEditModeNoteId(null);
  };

  return (
    <>
      <div
        ref={cardRef}
        className="group relative w-full h-full bg-yellow-200 border border-yellow-500 rounded p-3 shadow-lg z-3"
      >
        {!isEditMode && (
          <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              className="cursor-pointer bg-white rounded px-2 py-1 text-sm shadow hover:bg-gray-100"
              onClick={handleEditClicked}
            >
              Edytuj
            </button>
            <button
              className="cursor-pointer bg-white rounded px-2 py-1 text-sm shadow hover:bg-red-100 text-red-600"
              onClick={handleDeleteClicked}
            >
              Usuń
            </button>
          </div>
        )}

        {isEditMode ? (
          <NoteEditor id={id} content={content} onSave={handleSave} onCancel={handleCancel} />
        ) : (
          <div className="editor-container read-only">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <ConfirmModal
          message="Czy na pewno chcesz usunąć tę notatkę?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          confirmText="Usuń"
          cancelText="Anuluj"
        />
      )}
    </>
  );
}
