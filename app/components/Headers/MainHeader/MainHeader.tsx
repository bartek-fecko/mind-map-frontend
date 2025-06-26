import Link from 'next/link';
import NotificationInfo from '../NotificationsInfo';
import UserInfo from '../UserInfo';
import CreateBoardButton from '../../CreateBoardButton/CreateBoardButton';
import styles from '../Header.module.css'; //unused
import LogoIcon from '../../Icons/LogoIcon';

const MainHeader = () => {
  return (
    <header
      className={`sticky top-0 z-50 flex justify-between items-center px-4 py-2 rounded-none bg-bg-primary ${styles.header}`}
    >
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        {/* <div className="w-10 h-10 bg-primary-base rounded-lg flex items-center justify-center text-white font-bold text-[16px]">
          <Image width={24} height={24} src={'/logo.png'} alt="logo" />
        </div> */}
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
        <CreateBoardButton />
        <NotificationInfo />
        <UserInfo />
      </div>
    </header>
  );
};

export default MainHeader;
