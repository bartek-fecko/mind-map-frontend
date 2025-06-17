import Link from 'next/link';
import CreateBoardForm from './board/CreateBoardForm';
import { Board } from './types/board';
import ShareBoardModal from './components/ShareBoardModal/ShareBoardModal';
import { getSessionServer } from '@/lib/auth';
import LoginPage from './login/page';
import GoogleLogin from './components/GoogleLogin/GoogleLogin';

export default async function HomePage() {
  const session = await getSessionServer();

  if (!session?.user) {
    return <LoginPage />;
  }

  const res = await fetch(`${process.env.API_URL}/boards`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${session?.backendTokens.accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) return <LoginPage />;

  const boards: Board[] = await res.json();

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
      <div className='w-50'>
        <GoogleLogin />
      </div>
    </div>
  );
}
