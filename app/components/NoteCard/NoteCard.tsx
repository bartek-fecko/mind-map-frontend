import { FocusEvent } from 'react';
import { useNoteStore } from '../../store/useNoteStore';
import { useSocket } from '@/app/providers/SocketProvider';
import { NotesSocketEvents } from '@/app/store/socketEvents';
import { useHistoryStore } from '@/app/store/useHistoryStore';

type Props = {
  id: string;
  x: string;
  y: string;
  content: string;
};

export default function NoteCard({ id, x, y, content }: Props) {
  const { updateNote } = useNoteStore();
  const { socket } = useSocket();

  const updateNoteContent = (id: string, content: string) => {
    const currentNote = useNoteStore.getState().notes.find((note) => note.id === id);
    if (!currentNote) return;

    const prevNote = JSON.parse(JSON.stringify(currentNote));
    const newNote = { ...prevNote, content };

    updateNote(id, newNote);
    socket.emit(NotesSocketEvents.UPDATE, newNote);

    useHistoryStore.getState().pushAction({
      type: 'note-update',
      payload: { id, content },
      undo: () => {
        updateNote(id, JSON.parse(JSON.stringify(prevNote)));
        socket.emit(NotesSocketEvents.UPDATE, prevNote);
      },
      redo: () => {
        updateNote(id, JSON.parse(JSON.stringify(newNote)));
        socket.emit(NotesSocketEvents.UPDATE, newNote);
      },
    });
  };

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    updateNoteContent(id, e.currentTarget.textContent || '');
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
