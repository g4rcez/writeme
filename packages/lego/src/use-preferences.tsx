import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { LocalStorage } from "storage-manager-js";

const context = createContext<[state: any, setPreference: <T>(key: string, val: T) => void] | null>(null);

const getPreference = <T extends {}>(key: string, defaultValue: T): T =>
  LocalStorage.get<T>(`writeme/${key}`) ?? (defaultValue as any);

const setPreference = <T extends {}>(key: string, value: T): void => LocalStorage.set<T>(`writeme/${key}`, value);

export const Preferences = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<{}>(() => ({}));

  const callback = useCallback(<T extends {}>(key: string, val: T) => {
    setState((prev) => ({ ...prev, [key]: val }));
    setPreference(key, val);
  }, []);

  return <context.Provider value={[state, callback]}>{children}</context.Provider>;
};
