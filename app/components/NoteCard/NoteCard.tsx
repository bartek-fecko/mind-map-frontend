import { FocusEvent } from 'react';
import { useNoteStore } from '../../store/useNoteStore';
import { useSocket } from '@/app/providers/SocketProvider';
import { NotesSocketEvents } from '@/app/store/socketEvents';

type Props = {
  id: string;
  x: string;
  y: string;
  content: string;
};

export default function NoteCard({ id, x, y, content }: Props) {
  const { updateNote } = useNoteStore();
  const { socket, queueOfflineEvent } = useSocket();

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    const newNote = { id, x: `${x}`, y: `${y}`, content: e.currentTarget.textContent || '' };
    updateNote(id, newNote);

    if (socket.connected) {
      socket.emit(NotesSocketEvents.UPDATE, newNote);
    } else {
      queueOfflineEvent({
        type: NotesSocketEvents.UPDATE,
        payload: newNote,
      });
    }
  };

  return (
    <div
      className="absolute bg-yellow-200 border border-yellow-500 rounded p-3 shadow-lg z-3"
      style={{ top: parseInt(y), left: parseInt(x) }}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
    >
      {content}
    </div>
  );
}
