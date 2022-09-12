import ProgressBar from "@badrap/bar-of-progress";
import { SiteContainer } from "components/container";
import { SearchBar, ShortcutItem } from "components/search-bar";
import { useDarkMode } from "hooks/use-dark-mode";
import { NextComponentType, NextPageContext } from "next";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { FormEvent, Fragment, useCallback, useMemo, useRef, useState } from "react";
import { FaSun } from "react-icons/fa";
import Light from "styles/themes/light.json";
import "../styles/globals.css";

const progress = new ProgressBar({
  size: 3,
  color: Light.main.normal,
  className: "z-50",
  delay: 10,
});

Router.events.on("routeChangeStart", () => progress.start);
Router.events.on("routeChangeError", () => progress.finish());
Router.events.on("routeChangeComplete", () => setTimeout(() => progress.finish(), 1000));

function Content({ Component, pageProps }: { Component: NextComponentType<NextPageContext, any, {}>; pageProps: any }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [show, setShow] = useState(false);
  const { setMode, onToggleMode } = useDarkMode();

  const goToPage = useCallback(
    async (path: string) => {
      await router.push(path);
      setShow(false);
    },
    [router]
  );

  const shortcutsList = useMemo(
    (): ShortcutItem[] => [
      {
        category: "Pages",
        items: [
          { name: "Home", shortcuts: [["Alt", "H"]], target: () => goToPage("/") },
          { name: "Getting Started", shortcuts: [["Alt", "P"]], target: () => goToPage("/docs/getting-started/") },
        ],
      },
      {
        category: "Themes",
        items: [
          { name: "Dark mode", shortcuts: [["Alt", "z"]], target: () => setMode("dark") },
          { name: "Light mode", shortcuts: [["Alt", "x"]], target: () => setMode("light") },
        ],
      },
    ],
    [goToPage, setMode]
  );

  const toggleSearchBar = useCallback(() => setShow((p) => !p), []);

  const submit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  return (
    <Fragment>
      <Head>
        <meta title="WriteMe" />
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
            </ul>
          </section>
          <div className="flex gap-x-4">
            <form onSubmit={submit} className="flex gap-x-4 justify-between align-middle self-center items-center">
              <button className="bg-transparent p-0 m-0" onClick={onToggleMode}>
                <FaSun />
              </button>
            </form>
          </div>
        </SiteContainer>
      </header>
      <Component {...pageProps} />
    </Fragment>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const { session, ...componentProps } = pageProps as any;
  return (
    <SessionProvider session={session}>
      <Content Component={Component} pageProps={componentProps} />
    </SessionProvider>
  );
}
