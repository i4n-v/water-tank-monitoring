import { useContext } from 'react';
import { NotifierContext, SHOW_NOTIFICATION, HIDE_NOTIFICATION } from '../contexts/NotifierContext';

export default function useNotifier() {
  const { dispatch } = useContext(NotifierContext);

  const notify = (message: string, severity: 'success' | 'error', seconds = 5) => {
    dispatch({
      type: SHOW_NOTIFICATION,
      payload: {
        message,
        severity,
        seconds,
      },
    });
  };

  const closeNotify = () => {
    dispatch({
      type: HIDE_NOTIFICATION,
    });
  };

  return { notify, closeNotify };
}
