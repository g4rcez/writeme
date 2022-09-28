import { LocalStorage } from "storage-manager-js";
import { createContext, Fragment, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { coreExtensionsEnabled, defaultExtensionsEnable } from "./editor/editor-preferences";

type Preferences = {
  extensions: string[];
  theme: string;
};

const initialState: Preferences = {
  theme: "dark",
  extensions: coreExtensionsEnabled.concat(defaultExtensionsEnable),
};

const context = createContext<
  [state: Preferences, setPreference: <T extends keyof Preferences>(key: T, val: Preferences[T]) => void]
>([initialState, <T extends keyof Preferences>(k: T, val: Preferences[T]) => {}]);

export const getPreference = <T extends keyof Preferences>(key: T, defaultValue: Preferences[T]): Preferences[T] =>
  LocalStorage.get<Preferences[T]>(`writeme/${key}`) ?? (defaultValue as any);

export const setPreference = <T extends keyof Preferences>(key: T, value: Preferences[T]): void =>
  LocalStorage.set<Preferences[T]>(`writeme/${key}`, value);

export const Preferences = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<Preferences>(() => initialState);
  useEffect(() => {
    const theme = getPreference("theme", initialState.theme);
    const extensions = getPreference("extensions", initialState.extensions);
    setState({ theme, extensions });
  }, []);

  const callback = useCallback(<T extends keyof Preferences>(key: T, val: Preferences[T]) => {
    console.log({ key, val });
    setState((prev) => ({ ...prev, [key]: val }));
    setPreference(key, val);
  }, []);
  return <context.Provider value={[state, callback]}>{children}</context.Provider>;
};

export const usePreferences = () => useContext(context);
