import { Head, Html, Main, NextScript } from "next/document";
import { getSandpackCssText } from "@codesandbox/sandpack-react";

export default function MyDocument() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;900&display=swap" rel="stylesheet" />
        <link
          as="style"
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: getSandpackCssText() }} id="sandpack" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
