import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect } from "react";
import { setCssVars } from "./themes/themes";
import { LightTheme } from "./themes/light";
import { DarkTheme } from "./themes/dark";

type Modes = "light" | "dark";

const Context = createContext({
  mode: "" as Modes,
  onToggleMode: () => {},
  setMode: (n: Modes | ((prev: Modes) => Modes)) => {},
});

const useInternalDarkMode = () => {
  const [preferences, setPreference] = usePreferences();
  const setMode = useCallback((theme: string) => setPreference("theme", theme), [setPreference]);
  const mode = preferences.theme;

  useEffect(() => {
    const onChange = (event: any) => setMode(event.matches ? "dark" : "light");
    const match = window.matchMedia("(prefers-color-scheme: dark)");
    match.addEventListener("change", onChange);
    return () => match.removeEventListener("change", onChange);
  }, [setMode]);

  useEffect(() => {
    const isLight = mode === "light";
    if (isLight) document.documentElement.classList.remove("dark");
    else document.documentElement.classList.add("dark");
    setCssVars(document.documentElement, isLight ? LightTheme : DarkTheme);
  }, [mode]);

  const onToggleMode = useCallback(() => {
    if (mode === "dark") return setMode("light");
    return setMode("dark");
  }, [mode, setMode]);

  return { mode, setMode, onToggleMode };
};

export const DarkMode = ({ children }: PropsWithChildren) => {
  const mode = useInternalDarkMode();
  return <Context.Provider value={mode as any}>{children}</Context.Provider>;
};

export const useDarkMode = () => useContext(Context);
