'use client';

import ErrorIcon from '../Icons/ErrorIcon';
import SuccessIcon from '../Icons/SuccessIcon';
import XIcon from '../Icons/XIcon';

type AlertProps = {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
  duration?: number;
};

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const successStyle = {
    backgroundColor: '#17A948FF',
    borderRadius: '12px',
    boxShadow: '0px 4px 9px #171a1f1C, 0px 0px 2px #171a1f1F',
  };

  const errorStyle = {
    backgroundColor: '#DC2626',
    borderRadius: '12px',
    boxShadow: '0px 4px 9px #7F1D1D66, 0px 0px 2px #7F1D1D99',
  };

  return (
    <div
      className="fixed bottom-6 right-6 max-w-[400px] px-4 py-3 rounded-md text-white font-semibold flex items-center shadow-lg"
      style={type === 'success' ? successStyle : errorStyle}
      role="alert"
    >
      <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
        {type === 'success' && <SuccessIcon />}
        {type === 'error' && <ErrorIcon />}
      </div>
      <span className="flex-grow px-2 text-sm pr-10">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white opacity-55 focus:outline-none cursor-pointer w-6 h-6 flex items-center justify-center flex-shrink-0"
        aria-label="Close alert"
      >
        <XIcon />
      </button>
    </div>
  );
};

export default Alert;
