import Link from "next/link";
import { useDarkMode } from "./use-dark-mode";

export const Navbar = () => {
  const { onToggleMode } = useDarkMode();
  return (
    <header
      id="writeme-header"
      className="fixed top-0 z-10 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-transparent"
    >
      <nav className="flex w-full justify-between py-4">
        <section className="flex items-baseline gap-x-8">
          <h1 className="text-lg font-extrabold">
            <Link href="/">Writeme</Link>
          </h1>
        </section>
        {/*<button className="bg-transparent p-0 m-0 focus:outline" onClick={onToggleMode}>*/}
        {/*  <FaSun />*/}
        {/*</button>*/}
      </nav>
    </header>
  );
};
