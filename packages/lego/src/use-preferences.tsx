import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { LocalStorage } from "storage-manager-js";

const context = createContext<[state: Record<string, any>, setPreference: (key: string, val: any) => void]>([
  {},
  () => {},
]);

const setPreference = <T extends {}>(key: string, value: T): void => LocalStorage.set<T>(`writeme/${key}`, value);

export const Preferences = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<{}>(() => ({}));

  useEffect(() => {
    const st = Object.entries(window.localStorage).reduce((acc, el) => ({ ...acc, [el[0]]: el[1] }), {});
    setState(st);
  }, []);

  const callback = useCallback(<T extends {}>(key: string, val: T) => {
    setState((prev) => ({ ...prev, [key]: val }));
    setPreference(key, val);
  }, []);

  return <context.Provider value={[state, callback]}>{children}</context.Provider>;
};

export const usePreferences = <T extends {}>(key: string, defaultValue: T) => {
  const [global, dispatch] = useContext(context)!;
  const ref = "writeme/" + key;
  const state: T = global[ref] ?? defaultValue;

  const set = useCallback((value: T) => dispatch(key, value), [key, dispatch]);

  return [state, set] as const;
};
