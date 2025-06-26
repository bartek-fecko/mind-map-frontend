'use client';

import React, { useEffect, useRef } from 'react';

type CheckboxProps = {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  className?: string;
};

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled,
  indeterminate = false,
  className,
}) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label
      className={`
        ${className}
        relative flex items-center cursor-pointer select-none
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
      `}
    >
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} ref={ref} className="hidden" />
      <div
        className={`
          w-5 h-5 flex items-center justify-center rounded-[4px] mr-2
          ${checked ? 'bg-indigo-600 border-0' : 'bg-white border border-gray-400'}
        `}
      >
        {checked && !indeterminate && (
          <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
            <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        )}
        {indeterminate && <div className="w-3 h-3 rounded-[2px] bg-white" />}
      </div>
      {label && <span className="text-sm text-[#171A1FFF]">{label}</span>}
    </label>
  );
};

export default Checkbox;
