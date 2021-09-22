import { SearchBar, ShortcutItem } from "components/search-bar";
import type { AppProps } from "next/app";
import Link from "next/link";
import { FormEvent, Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Colors from "../styles/colors.json";
import "../styles/globals.css";
import { FaSearch, FaSun } from "react-icons/fa";
import { SiteContainer } from "components/container";
import { Router, useRouter } from "next/router";
import ProgressBar from "@badrap/bar-of-progress";
import Head from "next/head";
import { shortcutKeys } from "shortcut-keys";

const setColor = (varName: string, color: string, root: HTMLElement) => root.style.setProperty(varName, color);

type Styles = typeof Colors;

const setCssVars = (colors: Styles, element: HTMLElement) =>
  Object.entries(colors).forEach(([key, value]) => {
    if (typeof value === "string") {
      setColor(`--${key}`, value, element);
    } else if (typeof value === "object") {
      Object.entries(value).forEach(([secKey, secVal]: [string, string]) => {
        setColor(`--${key}-${secKey}`, secVal, element);
      });
    }
  });

const progress = new ProgressBar({
  size: 3,
  color: "#3B82F6",
  className: "bar-of-progress",
  delay: 10,
});

Router.events.on("routeChangeStart", () => progress.start);
Router.events.on("routeChangeError", () => progress.finish());
Router.events.on("routeChangeComplete", () => setTimeout(() => progress.finish(), 1000));

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [show, setShow] = useState(false);

  const goToPage = useCallback(
    (path: string) => {
      router.push(path);
      setShow(false);
    },
    [router]
  );

  const shortcutsList = useMemo(
    (): ShortcutItem[] => [
      {
        category: "Pages",
        items: [
          { name: "Home", shortcuts: [["Ctrl", "H"]], target: () => goToPage("/") },
          { name: "Getting Started", shortcuts: [["Ctrl", "P"]], target: () => goToPage("/docs/getting-started/") },
        ],
      },
      {
        category: "Themes",
        items: [
          { name: "Dark mode", shortcuts: [["Ctrl", "D"]], target: () => {} },
          { name: "Light mode", shortcuts: [["Ctrl", "L"]], target: () => {} },
        ],
      },
    ],
    [goToPage]
  );

  const toggleSearchBar = useCallback(() => setShow((p) => !p), []);

  const submit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  const onToggleDarkMode = () => {
    alert("Dark mode is coming");
  };

  useEffect(() => {
    setCssVars(Colors, document.documentElement);
  }, []);

  useEffect(() => {
    const windowElement = shortcutKeys(window);
    windowElement.add("control+k", toggleSearchBar, true);
    windowElement.add("control+h", () => goToPage("/"), true);
    windowElement.add("control+p", () => goToPage("/docs/getting-started/"), true);
    window.addEventListener("keydown", (e: KeyboardEvent) =>
      e.key.toLowerCase() === "escape" ? setShow(false) : undefined
    );

    return () => {
      windowElement.remove("control+k");
      windowElement.remove("control+h");
      windowElement.remove("control+p");
      window.removeEventListener("keydown", close);
    };
  }, [goToPage, toggleSearchBar]);

  return (
    <Fragment>
      <Head>
        <meta key="og:description" property="og:description" content="Write docs without effort" />
        <meta key="og:type" property="og:type" content="article" />
        <meta key="twitter:description" name="twitter:description" content="Write docs without effort" />
      </Head>
      <header id="writeme-header" className="flex sticky z-10 top-0 justify-between w-full text-white bg-gray-700">
        <SearchBar show={show} onChange={setShow} onOverlayClick={toggleSearchBar} shortcutList={shortcutsList} />
        <SiteContainer tag="nav" className="py-4 flex flex-nowrap items-center justify-between">
          <section className="flex items-baseline gap-x-8">
            <h1 className="font-extrabold text-lg">
              <Link href="/">WriteMe</Link>
            </h1>
            <ul className="flex gap-x-4 list-none">
              <li>
                <Link href="/docs/getting-started/">Docs</Link>
              </li>
              <li>
                <Link href="/blog/">Blog</Link>
              </li>
            </ul>
          </section>
          <form onSubmit={submit} className="flex gap-x-4 justify-between align-middle self-center items-center">
            <button className="bg-transparent p-0 m-0" onClick={onToggleDarkMode}>
              <FaSun />
            </button>
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
      <Component {...pageProps} />
    </Fragment>
  );
}
