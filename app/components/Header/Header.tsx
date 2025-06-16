import styles from './Header.module.css';
import UserInfo from './UserInfo';

const Header = () => {
  return (
    <header className={styles.header}>
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary-base rounded-lg flex items-center justify-center text-white font-bold text-[16px]">
          M
        </div>
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-lg text-gray-800">Mind Map</span>
        </div>
        <span className="ml-4 text-gray-500 cursor-pointer">Calendar</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <div className={`${styles.textbox} relative`}>
          <svg
            className={styles.searchIcon}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search..." />
        </div>
        <button className={`${styles.share} rounded hover:bg-purple-50`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6f42c1ff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
            <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
          </svg>
          Share
        </button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9095a0ff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="cursor-pointer"
        >
          <path d="M10.268 21a2 2 0 0 0 3.464 0" />
          <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
        </svg>
        <UserInfo />
      </div>
    </header>
  );
};

export default Header;
