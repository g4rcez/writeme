import { SearchBar } from "components/search-bar";
import type { AppProps } from "next/app";
import { FormEvent, Fragment, useCallback, useEffect, useRef, useState } from "react";
import Colors from "../styles/colors.json";
import "../styles/globals.css";

const setColor = (varName: string, color: string, root: HTMLElement) => root.style.setProperty(varName, color);

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

export default function App({ Component, pageProps }: AppProps) {
  const input = useRef<HTMLInputElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setCssVars(Colors, document.documentElement);
  }, []);

  const submit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  return (
    <Fragment>
      <header id="writeme-header" className="flex fixed z-10 top-0 justify-between w-full text-white bg-gray-700">
        <SearchBar show={show} />
        <nav className="w-full container mx-auto p-4 flex flex-nowrap items-baseline justify-between">
          <section className="flex items-baseline gap-x-8">
            <h1 className="font-extrabold text-lg">WriteMe</h1>
            <ul className="flex gap-x-4 list-none">
              <li>Docs</li>
              <li>Blog</li>
            </ul>
          </section>
          <form onSubmit={submit} className="flex gap-x-4 align-middle self-center items-baseline">
            <h2>☀️</h2>
            <input
              ref={input}
              className="bg-gray-800 px-2 py-0.5 placeholder-shown:text-white rounded-lg text-base"
              placeholder="Search...CTRL+K"
              type="text"
            />
          </form>
        </nav>
      </header>
      <section className="overflow-x-hidden">
        <Component {...pageProps} />
      </section>
    </Fragment>
  );
}
