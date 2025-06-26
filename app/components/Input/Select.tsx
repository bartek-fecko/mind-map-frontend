'use client';

import React from 'react';

type SelectProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  options: { label: string; value: string }[];
  placeholder?: string;
};

function DropdownIcon() {
  return (
    <svg
      className="pointer-events-none absolute top-3 right-3 w-4 h-4 fill-current text-[#171A1FFF]"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const Select: React.FC<SelectProps> = ({ value, onChange, disabled, options, placeholder }) => {
  return (
    <div className="relative dropdown inline-block">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-[144px] h-9 px-3 pr-9
          font-inter text-[14px] leading-[22px] font-normal text-[#171A1FFF]
          bg-[#F3F4F6FF] rounded-[6px] border-0 outline-none
          hover:bg-[#F3F4F6FF] hover:text-[#171A1FFF]
          disabled:bg-[#F3F4F6FF] disabled:text-[#171A1FFF]
          appearance-none
          ${!disabled && 'cursor-pointer'}
        `}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <DropdownIcon />
    </div>
  );
};

export default Select;
