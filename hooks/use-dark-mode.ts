import { useCallback, useEffect, useState } from "react";
import Light from "styles/themes/light.json";
import Dark from "styles/themes/dark.json";
import { setCssVars } from "styles/themes/themes";
import { useMedia } from "./use-media";
import { LocalStorage } from "storage-manager-js";

const preferDarkQuery = ["(prefers-color-scheme: dark)"];

type Modes = "light" | "dark";

const KEY = "@writeme/theme";

const defaultValue: Modes[] = ["light", "dark"];

export const useDarkMode = () => {
  const media = useMedia<Modes>(preferDarkQuery, defaultValue, "light");
  const [mode, setMode] = useState<Modes>(media);

  useEffect(() => {
    const storageValue = LocalStorage.get(KEY);
    if (storageValue) return setMode(storageValue);
    return setMode(media);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
