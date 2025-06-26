type InputProps = {
  label: string;
  type: string;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  required?: boolean;
};

const Input: React.FC<InputProps> = ({
  label,
  type,
  value,
  name,
  onChange,
  disabled,
  error,
  placeholder,
  required = false,
}) => {
  return (
    <div className="textbox">
      <span className="text-[14px] leading-[22px] font-semibold text-label-base flex items-center">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full h-[36px] 
          pl-[12px] pr-[12px]
          font-['Inter'] text-[14px] leading-[22px] font-normal
          bg-[#F3F4F6] rounded-[6px] border-0 outline-none
          ${disabled ? 'text-[#BCC1CA] bg-[#F3F4F6]' : ''}
          ${error ? 'ring-1 ring-red-500' : ''}
        `}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;
