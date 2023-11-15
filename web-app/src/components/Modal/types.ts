import { ReactNode } from 'react';

interface IModalProps {
  display: boolean;
  title?: string;
  className?: string;
  fullWidth?: boolean;
  children?: ReactNode;
  onClose?: () => void;
}

export default IModalProps;
