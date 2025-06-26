import { Board } from '@/app/types/board';
import SearchInput from '../../Input/SearchInput';
import ShareButton from '../../ShareButton/ShareButton';
import styles from '../Header.module.css';
import NotificationInfo from '../NotificationsInfo';
import UserInfo from '../UserInfo';
import Link from 'next/link';

interface BoardsHeaderProps {
  board: Board;
}

const BoardsHeader = ({ board }: BoardsHeaderProps) => {
  return (
    <header className={`${styles.header} w-screen bg-bg-primary`}>
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary-base rounded-lg flex items-center justify-center text-white font-bold text-[16px]">
          M
        </div>
        <div className="flex items-center space-x-1">
          <Link href="/">
            <span className="font-semibold text-lg text-gray-800">Mind Map</span>
          </Link>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <SearchInput />
        <ShareButton boardId={board.id} boardTitle={board.title} />
        <NotificationInfo />
        <UserInfo />
      </div>
    </header>
  );
};

export default BoardsHeader;
