import React, { createElement } from "react";

export const Text: React.FC = ({ children }) => (children && <p className="text-paragraph">{children}</p>) || null;

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> & {
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

export const Heading: React.FC<Props> = (props: any) =>
  createElement(
    props.tag,
    {
      ...props,
      className: `mt-1 tabular-nums antialiased font-bold text-text-paragraph leading-relaxed ${props.className ?? ""} ${
        props.size
      }`,
    },
    props.children
  );
