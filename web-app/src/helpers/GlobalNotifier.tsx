import { useContext } from 'react';
import { createPortal } from 'react-dom';
import { NotifierContext } from '../contexts/NotifierContext';
import useNotifier from '../hooks/useNotifier';
import { Notifier } from '../components';

const GlobalNotifier = () => {
  const { state } = useContext(NotifierContext);
  const { closeNotify } = useNotifier();

  const portalElement = document.getElementById('root')!;

  return createPortal(
    <Notifier
      open={state.show}
      message={state.message}
      severity={state.severity}
      timeToClose={state.seconds}
      onClose={closeNotify}
    />,
    portalElement,
  );
};

export default GlobalNotifier;
