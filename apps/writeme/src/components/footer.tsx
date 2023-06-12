import { VscGithub } from "react-icons/vsc";
import React from "react";

export const Footer = () => (
  <footer className="mt-12 w-full px-6 py-12">
    <div className="container mx-auto flex w-full items-center justify-center gap-x-4 text-center">
      Work in Progress
      <a
        className="link:text-black dark:link:text-white transition-colors duration-300 ease-out"
        href="https://github.com/g4rcez/writeme"
      >
        <VscGithub className="mb-1 text-3xl" />
      </a>
    </div>
  </footer>
);
