import { Board } from '@/app/types/board';
// import SearchInput from '../../Input/SearchInput';
import ShareButton from '../../ShareButton/ShareButton';
import styles from '../Header.module.css';
import NotificationInfo from '../NotificationsInfo';
import UserInfo from '../UserInfo';
import Link from 'next/link';
import LogoIcon from '../../Icons/LogoIcon';

interface BoardsHeaderProps {
  board: Board;
}

const BoardsHeader = ({ board }: BoardsHeaderProps) => {
  return (
    <header className={`${styles.header} w-screen bg-bg-primary`}>
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center text-white">
          <LogoIcon />
        </div>
        <div className="flex items-center space-x-1">
          <Link href="/">
            <span className="font-semibold text-lg text-gray-800">Mind Map</span>
          </Link>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* <SearchInput value="" onChange={() => {}} /> */}
        <ShareButton boardId={board.id} boardTitle={board.title} />
        <NotificationInfo />
        <UserInfo />
      </div>
    </header>
  );
};

export default BoardsHeader;
