import React from "react";

type Props = {
  className?: string;
  ref?: React.RefObject<HTMLDivElement>;
  tag?: "section" | "div" | "header" | "nav" | "article";
};

// eslint-disable-next-line react/display-name
export const SiteContainer: React.FC<Props> = React.forwardRef<HTMLDivElement, Props>(
  ({ className = "", tag = "section", children }, externalRef) =>
    React.createElement(tag, { className: `w-full max-w-7xl mx-auto sm:px-0 px-4 ${className}`, ref: externalRef }, children)
) as any;
