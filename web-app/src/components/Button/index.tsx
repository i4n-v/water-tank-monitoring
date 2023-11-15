//@ts-ignore
import Loading from '../../assets/loading-button.svg?react';
import IButtonProps from './types';

const SubmitButton = ({ type = 'submit', disabled, loading, children, onClick, className }: IButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`bg-blue-400 font-title text-xs font-semibold text-neutral-50 h-14 px-10 rounded-md transition-all hover:bg-blue-500 cursor-pointer uppercase disabled:cursor-default disabled:bg-blue-300 disabled:hover:bg-blue-300 ${className}`}
    >
      {loading ? <Loading className="fill-blue-50 animate-spin m-auto" /> : children}
    </button>
  );
};

export default SubmitButton;
