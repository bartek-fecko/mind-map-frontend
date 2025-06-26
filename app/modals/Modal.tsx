'use client';

import { ReactNode } from 'react';
import XIcon from '../components/Icons/XIcon';

type ModalProps = {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md';
  className?: string;
  wrapperClassName?: string;
};

export default function Modal({
  title,
  description,
  onClose,
  children,
  size,
  className,
  wrapperClassName,
}: ModalProps) {
  return (
    <div className={`${className} fixed inset-0 bg-black/30 flex items-center justify-center z-50`}>
      <div
        className={`bg-white w-full p-6 relative shadow-modal rounded-modal ${
          size === 'sm' ? 'max-w-[425px]' : 'max-w-2xl'
        }`}
      >
        <h2 className="text-[22px] leading-[36px] font-bold text-label-base mb-2">{title}</h2>

        {description && <p className="text-sm text-label-secondary mb-6">{description}</p>}

        <button
          onClick={onClose}
          className="absolute top-6 right-4 text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
        >
          <XIcon className="w-5 h-5 stroke-[#9095A0FF] mr-[4px]" />
        </button>

        <div className={wrapperClassName}>{children}</div>
      </div>
    </div>
  );
}
