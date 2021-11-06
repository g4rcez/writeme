import ProgressBar from "@badrap/bar-of-progress";
import { SiteContainer } from "components/container";
import { SearchBar, ShortcutItem } from "components/search-bar";
import { useDarkMode } from "hooks/use-dark-mode";
//@ts-ignore
import { useRemoteRefresh } from "next-remote-refresh/hook";
import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import { FormEvent, Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaSearch, FaSun } from "react-icons/fa";
import { shortcutKeys } from "shortcut-keys";
import "../styles/globals.css";
import Light from "styles/themes/light.json";

const progress = new ProgressBar({
  size: 3,
  color: Light.main.normal,
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
  const { setMode, onToggleMode } = useDarkMode();

  useRemoteRefresh({
    shouldRefresh: (path: string) => {
      if (process.env.NODE_ENV === "development") {
        if (path.includes("docs/") && /\.mdx?$/.test(path)) return true;
      }
      return false;
    },
  });

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
          { name: "Dark mode", shortcuts: [["Ctrl", "z"]], target: () => setMode("dark") },
          { name: "Light mode", shortcuts: [["Ctrl", "x"]], target: () => setMode("light") },
        ],
      },
    ],
    [goToPage, setMode]
  );

  const toggleSearchBar = useCallback(() => setShow((p) => !p), []);

  const submit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  useEffect(() => {
    const windowElement = shortcutKeys(window);
    windowElement.add("control+z", onToggleMode);
    windowElement.add("control+k", toggleSearchBar);
    windowElement.add("control+h", () => goToPage("/"));
    windowElement.add("control+p", () => goToPage("/docs/getting-started/"));
    windowElement.add("escape", () => setShow(false));

    return () => {
      windowElement.remove();
    };
  }, [goToPage, toggleSearchBar, onToggleMode]);

  return (
    <Fragment>
      <Head>
        <meta key="og:description" property="og:description" content="Write docs without effort" />
        <meta key="og:type" property="og:type" content="article" />
        <meta key="twitter:description" name="twitter:description" content="Write docs without effort" />
      </Head>
      <header
        id="writeme-header"
        className="flex sticky z-10 top-0 justify-between w-full text-navbar-text bg-navbar-bg"
      >
        <SearchBar show={show} onChange={setShow} onOverlayClick={toggleSearchBar} shortcutList={shortcutsList} />
        <SiteContainer tag="nav" className="py-4 flex flex-nowrap items-center justify-between">
          <section className="flex items-baseline gap-x-8">
            <h1 className="font-extrabold text-lg">
              <Link href="/">WriteMe</Link>
            </h1>
            <ul className="flex gap-x-4 list-none">
              <li>
                <Link href="/docs">Docs</Link>
              </li>
              <li>
                <Link href="/blog/">Blog</Link>
              </li>
            </ul>
          </section>
          <form onSubmit={submit} className="flex gap-x-4 justify-between align-middle self-center items-center">
            <button className="bg-transparent p-0 m-0" onClick={onToggleMode}>
              <FaSun />
            </button>
            <input
              ref={input}
              className="bg-transparent px-2 py-0.5 placeholder-shown:text-main-accent border-neutral-slight border rounded border-opacity-20 text-base hidden md:block"
              placeholder="Search...CTRL+K"
              type="text"
            />
            <button onClick={toggleSearchBar} className="bg-transparent p-2 rounded-full text-base block md:hidden">
              <FaSearch />
            </button>
          </form>
        </SiteContainer>
      </header>
      <Component {...pageProps} />
    </Fragment>
  );
}
