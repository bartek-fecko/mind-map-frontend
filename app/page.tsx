import { cookies } from 'next/headers';
import Link from 'next/link';
import CreateBoardForm from './board/CreateBoardForm';
import LoginButton from './components/LoginButton/LoginButton';
import { fetchApi } from '@/lib/api';
import { Board } from './types/board';
import Button from './components/Button/Button';
import ShareBoardModal from './components/ShareBoardModal/ShareBoardModal';

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return <LoginButton />;
  }

  const boards = await fetchApi<Board[]>('/boards');

  return (
    <div className="bg-secondary-base p-6 flex flex-col w-screen">
              {/* <ShareBoardModal /> */}
      
      <div className="flex justify-between items-center mb-6">
        {/* <div className="flex gap-2">
          <form action={`${process.env.API_URL}/auth/logout`} method="GET">
            <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
              Logout
            </button>
          </form>
        </div> */}
      </div>

      {/* Your Boards */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Boards</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {boards.map((board) => (
          <Link
            key={board.id}
            href={`/board/${board.id}`}
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col gap-2"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 to-purple-200  text-purple-600 text-2xl"></div>
            <h3 className="text-lg font-semibold text-gray-800">{board.title}</h3>
            <p className="text-gray-500 text-sm">Last edited recently</p>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                JD
              </div>
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">
                KL
              </div>
            </div>
          </Link>
        ))}
      </div>

      <CreateBoardForm />
    </div>
  );
}
