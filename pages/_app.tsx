import { SearchBar } from "components/search-bar";
import type { AppProps } from "next/app";
import { FormEvent, Fragment, useCallback, useEffect, useRef, useState } from "react";
import Colors from "../styles/colors.json";
import Link from "next/link";
import "../styles/globals.css";
import { FaSearch } from "react-icons/fa";
import { SiteContainer } from "components/container";

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

  const toggleSearchBar = useCallback(() => setShow((p) => !p), []);

  useEffect(() => {
    setCssVars(Colors, document.documentElement);
  }, []);

  const submit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  return (
    <Fragment>
      <header id="writeme-header" className="flex sticky z-10 top-0 justify-between w-full text-white bg-gray-700">
        <SearchBar show={show} />
        <SiteContainer tag="nav" className="py-4 flex flex-nowrap items-center justify-between">
          <section className="flex items-baseline gap-x-8">
            <h1 className="font-extrabold text-lg">WriteMe</h1>
            <ul className="flex gap-x-4 list-none">
              <li>
                <Link href="/docs/">Docs</Link>
              </li>
              <li>Blog</li>
            </ul>
          </section>
          <form onSubmit={submit} className="flex gap-x-4 justify-between align-middle self-center items-center">
            <h2>☀️</h2>
            <input
              ref={input}
              className="bg-gray-800 px-2 py-0.5 placeholder-shown:text-white rounded-lg text-base hidden md:block"
              placeholder="Search...CTRL+K"
              type="text"
            />
            <button onClick={toggleSearchBar} className="bg-gray-800 p-2 rounded-full text-base block md:hidden">
              <FaSearch />
            </button>
          </form>
        </SiteContainer>
      </header>
      <SiteContainer tag="section">
        <Component {...pageProps} />
      </SiteContainer>
    </Fragment>
  );
}
