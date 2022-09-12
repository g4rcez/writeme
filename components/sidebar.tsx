import Link from "next/link";
import React, { CSSProperties, Fragment } from "react";

type Props = {
  Render?: React.FC<{ title: string; props: unknown }>;
  items: Array<{
    name: string;
    items: Array<
      {
        title: string;
        link: string;
      } & unknown
    >;
  }>;
  className?: string;
  style?: CSSProperties;
  active: string;
};

export const Sidebar = React.forwardRef<HTMLDivElement, Props>(function Sidebar(
  { items, className = "", style, active }: Props,
  externalRef
) {
  return (
    <aside style={style} className={className} ref={externalRef}>
      {items.map((x) => {
        return (
          <Fragment key={x.name}>
            <header className="my-2 leading-tight font-bold">{x.name}</header>
            <section className="text-sm ml-4 flex flex-col">
              {x.items.map((x) => (
                <header
                  key={x.title}
                  className={`mb-1 hover:underline ${x.link === active ? "text-main-500 font-bold" : ""}`}
                >
                  <Link href={x.link}>{x.title}</Link>
                </header>
              ))}
            </section>
          </Fragment>
        );
      })}
    </aside>
  );
});
