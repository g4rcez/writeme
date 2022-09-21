import Link from "next/link";
import { FaSun } from "react-icons/fa";
import { useDarkMode } from "../hooks/use-dark-mode";

type Props = {};

export const Navbar = ({}: Props) => {
  const { onToggleMode } = useDarkMode();
  return (
    <header
      id="writeme-header"
      className="flex fixed z-10 top-0 justify-between w-screen bg-white dark:bg-transparent backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 shadow-sm px-6"
    >
      <nav className="py-4 flex justify-between w-full">
        <section className="flex items-baseline gap-x-8">
          <h1 className="font-extrabold text-lg">
            <Link passHref href="/">
              <a>Writeme</a>
            </Link>
          </h1>
        </section>
        <div className="flex gap-x-4">
          <button className="bg-transparent p-0 m-0" onClick={onToggleMode}>
            <FaSun />
          </button>
        </div>
      </nav>
    </header>
  );
};
