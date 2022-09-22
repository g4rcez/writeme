import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import Light from "styles/themes/light.json";
import Dark from "styles/themes/dark.json";
import { setCssVars } from "styles/themes/themes";
import { useMedia } from "./use-media";
import { LocalStorage } from "storage-manager-js";

const preferDarkQuery = ["(prefers-color-scheme: dark)"];

type Modes = "light" | "dark";

const KEY = "@writeme/theme";

const defaultValue: Modes[] = ["light", "dark"];

const Context = createContext({
  mode: "" as Modes,
  onToggleMode: () => {},
  setMode: (n: Modes | ((prev: Modes) => Modes)) => {},
});

export const DarkMode = ({ children }: PropsWithChildren) => {
  const mode = useInternalDarkMode();
  return <Context.Provider value={mode as any}>{children}</Context.Provider>;
};

const useInternalDarkMode = () => {
  const media = useMedia<Modes>(preferDarkQuery, defaultValue, "dark");
  const [mode, setMode] = useState<Modes | string>(media);

  useEffect(() => {
    const storageValue = LocalStorage.get<Modes>(KEY);
    if (storageValue) return setMode(storageValue);
    return setMode(media);
  }, [media]);

  useEffect(() => {
    LocalStorage.set(KEY, mode);
    const isLight = mode === "light";
    if (isLight) document.documentElement.classList.remove("dark");
    else document.documentElement.classList.add("dark");
    setCssVars(document.documentElement, isLight ? Light : Dark);
  }, [mode]);

  const onToggleMode = useCallback(() => setMode((prev) => (prev === "dark" ? "light" : "dark")), []);

  return { mode, setMode, onToggleMode };
};

export const useDarkMode = () => useContext(Context);
