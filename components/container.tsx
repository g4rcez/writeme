import React from "react";

type Props = {
  className?: string;
  ref?: React.RefObject<HTMLDivElement>;
  tag?: "section" | "div" | "header" | "nav" | "article";
};

// eslint-disable-next-line react/display-name
export const Container: React.FC<Props> = React.forwardRef<HTMLDivElement, Props>(
  ({ className = "", tag = "section", children }, externalRef) =>
    React.createElement(tag, { className: `mx-auto container w-full ${className}`, ref: externalRef }, children)
) as any;
