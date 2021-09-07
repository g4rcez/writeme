import "codemirror/lib/codemirror.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import Colors from "../styles/colors.json";
import "../styles/globals.css";

const setColor = (varName: string, color: string, root: HTMLElement) =>
  root.style.setProperty(varName, color);

type Styles = typeof Colors;

const setCssVars = (colors: Styles, element: HTMLElement) =>
  Object.entries(colors).forEach(([key, value]) => {
    if (typeof value === "string") {
      setColor(`--${key}`, value, element);
    } else if (typeof value === "object") {
      Object.entries(value).forEach(([secKey, secVal]: any) => {
        setColor(`--${key}-${secKey}`, secVal, element);
      });
    }
  });

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    setCssVars(Colors, document.documentElement);
  }, []);

  return <Component {...pageProps} />;
}
export default MyApp;
