import { NextComponentType, NextPageContext } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import React, { Fragment } from "react";
import "../styles/globals.css";
import { IconContext } from "react-icons";
import { CodeLanguageProvider } from "@writeme/markdown";
import { DarkMode, Navbar, Preferences } from "@writeme/lego";
import { Footer } from "../components/footer";

function Content({ Component, pageProps }: { Component: NextComponentType<NextPageContext, any, {}>; pageProps: any }) {
  return (
    <Fragment>
      <Head>
        <title>WriteMe</title>
        <meta title="WriteMe" />
        <meta key="og:type" property="og:type" content="website" />
      </Head>
      <div className="flex w-full min-w-full flex-col">
        <Navbar />
        <div className="mt-16 w-full min-w-full grow">
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>
    </Fragment>
  );
}

const iconContextValue = { className: "react-icons" };

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Preferences>
      <DarkMode>
        <CodeLanguageProvider>
          <IconContext.Provider value={iconContextValue}>
            <Content Component={Component} pageProps={pageProps} />
          </IconContext.Provider>
        </CodeLanguageProvider>
      </DarkMode>
    </Preferences>
  );
}
