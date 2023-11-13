import React, { ReactNode, useState } from 'react';

interface IGlobalProviderProps {
  children: ReactNode;
}

interface IDeviceId<T> {
  deviceId: T;
  setDeviceId: React.Dispatch<React.SetStateAction<T>>;
}

export const GlobalContext = React.createContext<IDeviceId<null | string> | null>(null);

export const GlobalContextProvider = ({ children }: IGlobalProviderProps) => {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  return <GlobalContext.Provider value={{ deviceId, setDeviceId }}>{children}</GlobalContext.Provider>;
};
