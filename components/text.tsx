import React, { createElement } from "react";

export const Text: React.FC = ({ children }) => (children && <p className="text-paragraph">{children}</p>) || null;

export const Heading = (props: any) =>
  createElement(
    props.tag,
    {
      ...props,
      className: `mt-1 tabular-nums antialiased font-bold text-gray-500 leading-relaxed ${props.className ?? ""} ${
        props.size
      }`,
    },
    props.children
  );
