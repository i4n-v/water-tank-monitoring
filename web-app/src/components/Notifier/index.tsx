import { useEffect } from 'react';
//@ts-ignore
import Success from '../../assets/success.svg?react';
//@ts-ignore
import Error from '../../assets/error.svg?react';
//@ts-ignore
import Close from '../../assets/close.svg?react';
import INotifierProps from './types';

const Notifier = ({ open, message, severity = 'success', onClose, timeToClose = 5 }: INotifierProps) => {
  const severities = {
    success: {
      container: 'bg-green-200',
      fill: 'fill-green-900',
      text: 'text-green-900',
      icon: <Success className="fill-green-900 w-4" />,
    },
    error: {
      container: 'bg-red-200',
      fill: 'fill-red-900',
      text: 'text-red-900',
      icon: <Error className="fill-red-900 w-5" />,
    },
  };

  useEffect(() => {
    if (open && onClose) {
      const seconds = timeToClose * 1000;
      const timeout = setTimeout(onClose, seconds);

      return () => clearTimeout(timeout);
    }
  }, [open, timeToClose, onClose]);

  if (!open) return null;

  return (
    <div
      className={`${severities[severity].container} px-4 rounded-md shadow-sm flex gap-2 items-center absolute top-20 left-[50%] -translate-x-[50%] animate-down z-50`}
    >
      {severities[severity].icon}
      <p className={`${severities[severity].text} text-xs mr-4`}>{message}</p>
      <Close onClick={onClose} className={`cursor-pointer ${severities[severity].fill} w-[0.6rem] mr-2`} />
    </div>
  );
};

export default Notifier;
