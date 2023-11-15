import { useRef } from 'react';
//@ts-ignore
import Close from '../../assets/close.svg?react';
import IModalProps from './types';

const Modal = ({ display = false, title, className, fullWidth = false, children, onClose }: IModalProps) => {
  const modal = useRef(null);

  if (!display) return null;

  return (
    <div
      ref={modal}
      className="absolute top-0 left-0 flex items-center px-6 bg-neutral-900/40 w-full h-full position-fixed z-50 shadow-md"
      onClick={({ target }) => {
        if (target === modal.current && onClose) {
          onClose();
        }
      }}
    >
      <div
        className={`w-full mx-auto bg-neutral-800 p-4 animate-down rounded-md ${
          fullWidth ? 'max-w-none' : 'max-w-4xl'
        } ${className}`}
      >
        <div className="p-1 flex justify-between w-full border-b border-neutral-400 mb-4">
          {title && <p className="text-size-h6 text-neutral-50 font-title">{title}</p>}
          <Close onClick={onClose} className="cursor-pointer fill-blue-400 w-3" />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
