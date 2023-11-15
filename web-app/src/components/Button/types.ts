import { ReactNode } from 'react';

interface IButtonProps {
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  children: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export default IButtonProps;
