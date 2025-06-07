import { MouseEvent, useRef } from 'react';
import NoteEditor from './NoteEditor';
import { useNotes } from '@/app/hooks/useNotes';
import { useNoteStore } from '@/app/store/useNoteStore';
import { useToolbarStore } from '@/app/store/useToolbarStore';

type Props = {
  id: string;
  x: string;
  y: string;
  content: string;
};

export default function NoteCard({ id, content }: Props) {
  const { updateNote } = useNotes(useRef(null));
  const cardRef = useRef<HTMLDivElement>(null);
  const { editModeNoteId, setEditModeNoteId } = useNoteStore();
  const isEditMode = editModeNoteId === id;
  const setTool = useToolbarStore((s) => s.setTool);

  const handleEditClicked = (e: MouseEvent) => {
    e.stopPropagation();
    setEditModeNoteId(id);
    setTool('none');
  };

  const handleSave = (newContent: string) => {
    updateNote({ id, content: newContent });
    setEditModeNoteId(null);
  };

  return (
    <div
      ref={cardRef}
      className="relative w-full h-full bg-yellow-200 border border-yellow-500 rounded p-3 shadow-lg z-3"
    >
      {!isEditMode && (
        <button
          className="cursor-pointer absolute top-2 right-2 bg-white rounded px-2 py-1 text-sm shadow hover:bg-gray-100"
          onClick={handleEditClicked}
        >
          Edytuj
        </button>
      )}

      {isEditMode ? (
        <NoteEditor id={id} content={content} onSave={handleSave} />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </div>
  );
}
