/* eslint-disable @next/next/no-img-element */
import ProgressBar from "@badrap/bar-of-progress";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { SiteContainer } from "components/container";
import { SearchBar, ShortcutItem } from "components/search-bar";
import { useDarkMode } from "hooks/use-dark-mode";
import { Is } from "lib/is";
import { Links } from "lib/links";
import { NextComponentType, NextPageContext } from "next";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
//@ts-ignore
// import { useRemoteRefresh } from "next-remote-refresh/hook";
import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { FormEvent, Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaSearch, FaSun } from "react-icons/fa";
import { shortcutKeys } from "shortcut-keys";
import Light from "styles/themes/light.json";
import "../styles/globals.css";

const progress = new ProgressBar({
  size: 3,
  color: Light.main.normal,
  className: "bar-of-progress",
  delay: 10,
});

Router.events.on("routeChangeStart", () => progress.start);
Router.events.on("routeChangeError", () => progress.finish());
Router.events.on("routeChangeComplete", () => setTimeout(() => progress.finish(), 1000));

const LoggedIn = () => {
  const session = useSession();
  if (Is.NilOrEmpty(session.data)) {
    return <button onClick={() => signIn()}>Sign in</button>;
  }
  if (Is.NilOrEmpty(session.data?.user)) {
    return <button onClick={() => signIn()}>Sign in</button>;
  }
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <img width="32px" src={session.data.user?.image!} alt="User avatar" className="rounded-full" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content loop sideOffset={8} className="dropdown">
        <DropdownMenu.Item onClick={() => Router.push(Links.adminGroups)} className="dropdown-item">
          Groups
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => Router.push(Links.adminDocuments)} className="dropdown-item">
          Documents
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          onClick={() => signOut()}
          className="dropdown-item hover:text-fail-hover focus:text-fail-hover"
        >
          Logout
        </DropdownMenu.Item>
        <DropdownMenu.Arrow />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

function Content({ Component, pageProps }: { Component: NextComponentType<NextPageContext, any, {}>; pageProps: any }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [show, setShow] = useState(false);
  const { setMode, onToggleMode } = useDarkMode();

  // useRemoteRefresh({
  //   shouldRefresh: (path: string) => {
  //     if (process.env.NODE_ENV === "development") {
  //       if (path.includes("docs/") && /\.mdx?$/.test(path)) return true;
  //     }
  //     return false;
  //   },
  // });

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

  useEffect(() => {
    const windowElement = shortcutKeys(window);
    const options = { multiPlatform: true, description: "shortcut", prevent: false };
    windowElement.add("alt+m", onToggleMode, options);
    windowElement.add("alt+z", () => setMode("dark"), options);
    windowElement.add("alt+x", () => setMode("light"), options);
    windowElement.add("alt+k", toggleSearchBar, options);
    windowElement.add("alt+h", () => goToPage("/"), options);
    windowElement.add("alt+p", () => goToPage("/docs/getting-started/"), options);
    windowElement.add("escape", () => setShow(false), options);

    return () => {
      windowElement.remove();
    };
  }, [goToPage, toggleSearchBar, onToggleMode, setMode]);

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
              {/* <li>
                <Link href="/blog/">Blog</Link>
              </li> */}
            </ul>
          </section>
          <div className="flex gap-x-4">
            <form onSubmit={submit} className="flex gap-x-4 justify-between align-middle self-center items-center">
              <button className="bg-transparent p-0 m-0" onClick={onToggleMode}>
                <FaSun />
              </button>
              <input
                ref={input}
                className="bg-transparent px-2 py-0.5 placeholder-shown:text-main-accent border-neutral-slight border rounded border-opacity-20 text-base hidden md:block"
                placeholder="Search...Alt+K"
                type="text"
              />
              <button onClick={toggleSearchBar} className="bg-transparent p-2 rounded-full text-base block md:hidden">
                <FaSearch />
              </button>
            </form>
            <LoggedIn />
          </div>
        </SiteContainer>
      </header>
      <Component {...pageProps} />
    </Fragment>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const { session, ...componentProps } = pageProps;
  return (
    <SessionProvider session={session}>
      <Content Component={Component} pageProps={componentProps} />
    </SessionProvider>
  );
}
