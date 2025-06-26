import { Board } from '../types/board';
import { getSessionServer } from '@/lib/auth';
import SignOut from '../components/SignOut/SignOut';
import BoardCard from '../components/BoardCard/BoardCard';
import MainHeader from '../components/Headers/MainHeader/MainHeader';
import CreateBoardCard from '../components/BoardCard/CreateBoardCard';

type HomePageBoardsResponse = Omit<Board, 'users'> & {
  users: Array<{
    role: string;
    user: {
      id: string;
      email: string;
      image: string | null;
    };
  }>;
};

export default async function HomePage() {
  const session = await getSessionServer();

  const res = await fetch(`${process.env.API_URL}/boards`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${session?.backendTokens?.accessToken}` || '',
      'Content-Type': 'application/json',
    },
  });

  if (res.status !== 200) return <SignOut />;

  const boards: HomePageBoardsResponse[] = await res.json();

  const userId = session?.user?.id;

  const ownedBoards = boards.filter((board) =>
    board.users.some(({ user, role }) => user.id === userId && role === 'owner'),
  );

  const sharedBoards = boards.filter((board) =>
    board.users.some(({ user, role }) => user.id === userId && role !== 'owner'),
  );

  return (
    <div className="flex flex-col h-full">
      <MainHeader />
      <div className="bg-secondary-base p-6 flex flex-col w-screen grow-1">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Twoje Tablice</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-[#2E2E2EFF] mb-14">
          {ownedBoards?.length === 0 && <CreateBoardCard />}
          {ownedBoards?.length > 0 &&
            ownedBoards?.map((board) => {
              const sharedUsers = board.users?.map(({ user }) => user);
              return <BoardCard key={board.id} {...board} users={sharedUsers} />;
            })}
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Udostępnione dla ciebie tablice</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-[#2E2E2EFF]">
          {sharedBoards?.length === 0 && <CreateBoardCard />}
          {sharedBoards?.length > 0 &&
            sharedBoards.map((board) => {
              const sharedUsers = board.users?.map(({ user }) => user);
              return <BoardCard key={board.id} {...board} users={sharedUsers} />;
            })}
        </div>
      </div>
    </div>
  );
}
