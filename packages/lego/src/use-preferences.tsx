import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { LocalStorage } from "storage-manager-js";

const Context = createContext<[state: Record<string, any>, setPreference: (key: string, val: any) => void]>([
  {},
  () => {},
]);

const setPreference = <T extends {}>(key: string, value: T): void => LocalStorage.set<T>(`writeme/${key}`, value);

export const Preferences = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<{}>(() => ({}));

  useEffect(() => {
    const st = Object.keys(window.localStorage).reduce((acc, key) => {
      const value = LocalStorage.get(key);
      if (!key.startsWith("writeme/")) return acc;
      const convertedKey = key.replace(/^writeme\//, "");
      return { ...acc, [convertedKey]: value };
    }, {});
    setState(st);
  }, []);

  const callback = useCallback(<T extends {}>(key: string, val: T) => {
    setState((prev) => ({ ...prev, [key]: val }));
    setPreference(key, val);
  }, []);

  return <Context.Provider value={[state, callback]}>{children}</Context.Provider>;
};

export const usePreferences = <T extends {}>(KEY: string, defaultValue: T) => {
  const [global, dispatch] = useContext(Context);
  const state: T = global[KEY] ?? defaultValue;
  const set = useCallback((value: T) => dispatch(KEY, value), [KEY, dispatch]);
  return [state, set] as const;
};
