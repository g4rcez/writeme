import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Links, Types } from "@writeme/core";

type Doc = Types.Nullable<{ url: string; title: string }>;

export const Box = ({ doc, back }: { doc: Doc; back?: boolean }) => {
  const isNull = doc === null;
  return (
    <Link
      aria-hidden={isNull}
      className={`${isNull ? "opacity-0" : ""} flex w-full max-w-sm rounded-md border p-4 dark:border-zinc-700 ${
        back ? "justify-start" : "justify-end"
      } link:underline link:text-main-300 link:border-main-300 dark:link:border-main-300 items-center gap-2 transition-colors duration-300`}
      href={Links.toDoc(doc?.url ?? "")}
      passHref
    >
      {back && <FaChevronLeft aria-hidden="true" className="mt-0.5" />}
      {doc?.title}
      {!back && <FaChevronRight aria-hidden="true" className="mt-0.5" />}
    </Link>
  );
};

type Props = {
  next: Doc;
  previous: Doc;
};

export const DocumentNavigation = ({ next, previous }: Props) => (
  <nav className="mt-8 flex w-full justify-between gap-8">
    <Box doc={previous} back />
    <Box doc={next} />
  </nav>
);
