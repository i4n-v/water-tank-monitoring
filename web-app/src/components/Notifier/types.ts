interface INotifierProps {
  open: boolean;
  message?: string;
  severity?: 'success' | 'error';
  onClose?: () => void;
  timeToClose?: number;
}

export default INotifierProps;
