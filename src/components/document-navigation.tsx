import { SimplerDocument } from "../writeme/storage/storage";
import Link from "next/link";
import { Links } from "../lib/links";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export const Box = ({ doc, back }: { doc: Types.Nullable<SimplerDocument>; back?: boolean }) => {
  const isNull = doc === null;
  return (
    <Link href={Links.toDoc(doc?.url ?? "")} passHref>
      <a
        aria-hidden={isNull}
        className={`${isNull ? "opacity-0" : ""} border p-4 w-full max-w-sm rounded-md dark:border-zinc-700 flex ${
          back ? "justify-start" : "justify-end"
        } items-center gap-2 link:underline link:text-main-300 link:border-main-300 dark:link:border-main-300 transition-colors duration-300`}
      >
        {back && <FaChevronLeft aria-hidden="true" className="mt-0.5" />}
        {doc?.title}
        {!back && <FaChevronRight aria-hidden="true" className="mt-0.5" />}
      </a>
    </Link>
  );
};

export const DocumentNavigation = ({
  next,
  previous,
}: {
  next: Types.Nullable<SimplerDocument>;
  previous: Types.Nullable<SimplerDocument>;
}) => {
  return (
    <nav className="w-full flex justify-between gap-8 mt-8">
      <Box doc={previous} back />
      <Box doc={next} />
    </nav>
  );
};
