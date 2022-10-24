import { NextComponentType, NextPageContext } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import React, { Fragment } from "react";
import "../styles/globals.css";
import { Navbar } from "../src/components/navbar";
import { VscGithub } from "react-icons/vsc";
import { DarkMode } from "../src/hooks/use-dark-mode";
import { Preferences } from "../src/components/preferences/preferences";
import { IconContext } from "react-icons";
import { Playground } from "../src/components";

function Content({ Component, pageProps }: { Component: NextComponentType<NextPageContext, any, {}>; pageProps: any }) {
  return (
    <Fragment>
      <Head>
        <title>WriteMe</title>
        <meta title="WriteMe" />
        <meta key="og:type" property="og:type" content="website" />
      </Head>
      <div className="flex h-screen flex-col justify-between gap-y-12">
        <Navbar />
        <div className="mt-16">
          <Component {...pageProps} />
        </div>
        <footer className="px-6 py-8 w-full border-t border-slate-200 dark:border-zinc-700">
          <div className="container w-full mx-auto text-center flex items-center justify-center gap-x-4">
            Work in Progress
            <a
              className="transition-colors duration-300 ease-out link:text-black dark:link:text-white"
              href="https://github.com/g4rcez/writeme"
            >
              <VscGithub className="text-3xl mb-1" />
            </a>
          </div>
        </footer>
      </div>
    </Fragment>
  );
}

const iconContextValue = { className: "react-icons" };

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Preferences>
      <DarkMode>
        <IconContext.Provider value={iconContextValue}>
          <Content Component={Component} pageProps={pageProps} />
        </IconContext.Provider>
      </DarkMode>
    </Preferences>
  );
}
