//@ts-ignore
import Search from '../../assets/search-icon.svg?react';
import IFormFieldProps from './types';

const FormField = ({
  register,
  error,
  name,
  type,
  label,
  disabled,
  placeholder,
  required,
  customOnChange,
  className,
}: IFormFieldProps) => {
  const activeError = error && !!error[name];

  const { onChange, ...settings } = register(name);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={`text-xs ${activeError ? 'text-red-400' : ' text-blue-400'} ${
            type === 'checkbox' ? '' : 'absolute -top-2.5 left-3 px-1'
          }`}
        >
          <span className="relative z-10">
            {label} {required && <span className="text-red-400 mr-1">*</span>}
          </span>
          {type !== 'checkbox' && <span className="absolute top-2.5 left-0 w-full h-1 bg-neutral-50" />}
        </label>
      )}
      <input
        id={name}
        type={type === 'search' ? 'text' : type}
        disabled={disabled}
        autoComplete="off"
        {...settings}
        onChange={(event) => {
          onChange(event);
          if (customOnChange) customOnChange(event.target.value);
        }}
        placeholder={placeholder}
        className={`w-full h-12 bg-neutral-50 rounded-md outline-none disabled:cursor-default disabled:hover:border border ${
          activeError ? 'border-red-400' : 'border-blue-400'
        } hover:border-2 focus:border-2 text-sm text-neutral-700 placeholder:text-neutral-400 px-2`}
      />
      {type === 'search' && <Search className="fill-blue-400 absolute top-3.5 right-3 w-5 h-5" />}
      {activeError && <p className="text-xs text-red-300 max-w-full ml-3">{error[name]?.message as string}</p>}
    </div>
  );
};

export default FormField;
