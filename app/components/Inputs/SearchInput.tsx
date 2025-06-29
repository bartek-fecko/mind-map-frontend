'use client';

import React from 'react';
import SearchIcon from '../Icons/SearchIcon';

type InputProps = {
  label?: string;
  type?: string;
  value: string;
  name?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
};

const SearchInput: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  name,
  onChange,
  disabled = false,
  error,
  placeholder = 'Search...',
}) => {
  return (
    <div className={`relative w-[256px] h-9 ${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}>
      <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
        <SearchIcon />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={label}
        className="w-full h-9 pl-[34px] pr-3 font-inter text-sm leading-[22px] font-normal bg-[#eee] rounded-md border-0 outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default SearchInput;
