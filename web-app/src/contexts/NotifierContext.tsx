import React, { ReactNode, useReducer } from 'react';

interface INotifierProviderProps {
  children: ReactNode;
}

interface INotifierState {
  show: boolean;
  message?: string;
  severity?: 'success' | 'error';
  seconds?: number;
}

interface IAction {
  payload?: Omit<INotifierState, 'show'>;
  type: 'SHOW_NOTIFICATION' | 'HIDE_NOTIFICATION';
}

export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
export const HIDE_NOTIFICATION = 'HIDE_NOTIFICATION';

export const initialState: INotifierState = {
  show: false,
  message: '',
  severity: 'success',
  seconds: 5,
};

const reducer = (_: any, action: IAction) => {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return {
        show: true,
        message: action.payload?.message,
        severity: action.payload?.severity,
        seconds: action.payload?.seconds,
      };
    case HIDE_NOTIFICATION:
      return initialState;
    default:
      return initialState;
  }
};

const initialDispatch = () => {};

export const NotifierContext = React.createContext({
  state: initialState,
  dispatch: initialDispatch as React.Dispatch<IAction>,
});

export const NotifierContextProvider = ({ children }: INotifierProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <NotifierContext.Provider value={{ state, dispatch }}>{children}</NotifierContext.Provider>;
};
