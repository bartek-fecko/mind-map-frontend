import { useNoteStore } from '../../store/useNoteStore';

type Props = {
  id: string;
  x: number;
  y: number;
  content: string;
};

export default function NoteCard({ id, x, y, content }: Props) {
  const { updateNote } = useNoteStore();

  return (
    <div
      className="absolute bg-yellow-200 border border-yellow-500 rounded p-3 shadow-lg"
      style={{ top: y, left: x }}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => updateNote(id, { content: e.currentTarget.textContent || '' })}
    >
      {content}
    </div>
  );
}
