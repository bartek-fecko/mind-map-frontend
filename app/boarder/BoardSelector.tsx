import { useEffect, useState } from 'react';

type Board = { id: string; name: string };

export default function BoardSelector({ onSelect }: { onSelect: (id: string) => void }) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [newBoardName, setNewBoardName] = useState('');

  useEffect(() => {
    fetch('/boards')
      .then((res) => res.json())
      .then(setBoards);
  }, []);

  const createBoard = async () => {
    const res = await fetch('/boards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newBoardName }),
    });
    const board = await res.json();
    setBoards([...boards, board]);
    onSelect(board.id);
  };

  return (
    <div>
      <h2>Wybierz tablicę:</h2>
      {boards.map((board) => (
        <button key={board.id} onClick={() => onSelect(board.id)}>
          {board.name}
        </button>
      ))}

      <h3>Utwórz nową tablicę:</h3>
      <input value={newBoardName} onChange={(e) => setNewBoardName(e.target.value)} placeholder="Nazwa nowej tablicy" />
      <button onClick={createBoard}>Utwórz</button>
    </div>
  );
}
