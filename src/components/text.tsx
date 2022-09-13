import React, { createElement, PropsWithChildren } from "react";

export const Text = ({ children }: PropsWithChildren) =>
  (children && <p className="text-paragraph">{children}</p>) || null;

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> & {
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: string;
};

export const Heading = ({ tag, ...props }: PropsWithChildren<Props>) =>
  createElement(
    tag,
    {
      ...props,
      className: `mt-1 tabular-nums antialiased font-bold text-text-paragraph leading-relaxed ${
        props.className ?? ""
      } ${props.size}`,
    },
    props.children
  );
