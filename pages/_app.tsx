import ProgressBar from "@badrap/bar-of-progress";
import { NextComponentType, NextPageContext } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";
import React, { Fragment } from "react";
import Light from "styles/themes/light.json";
import "../styles/globals.css";
import { Navbar } from "../src/components/navbar";
import { VscGithub } from "react-icons/vsc";

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
  return (
    <Fragment>
      <Head>
        <meta title="WriteMe" />
        <meta key="og:description" property="og:description" content="Write docs without effort" />
        <meta key="og:type" property="og:type" content="article" />
        <meta key="twitter:description" name="twitter:description" content="Write docs without effort" />
      </Head>
      <div className="flex h-screen flex-col justify-between">
        <Navbar />
        <Component {...pageProps} />
        <div className="px-6 py-8 w-full border-t border-slate-200 dark:border-zinc-700">
          <footer className="container w-full mx-auto text-center flex items-center justify-center gap-x-4">
            Working in Progress
            <a className="transition-colors duration-300 ease-out link:text-black dark:link:text-white" href="https://github.com/g4rcez/writeme">
              <VscGithub className="text-3xl mb-2" />
            </a>
          </footer>
        </div>
      </div>
    </Fragment>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return <Content Component={Component} pageProps={pageProps} />;
}
