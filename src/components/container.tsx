import React, { PropsWithChildren } from "react";

type Props = {
  className?: string;
  ref?: React.RefObject<HTMLDivElement>;
  tag?: "section" | "div" | "header" | "nav" | "article";
};

export const SiteContainer = React.forwardRef<HTMLDivElement, PropsWithChildren<Props>>(function InnerSiteContainer(
  { className = "", tag = "section", children },
  externalRef
) {
  return React.createElement(
    tag,
    {
      className: `w-full max-w-7xl mx-auto sm:px-0 px-4 ${className}`,
      ref: externalRef,
    },
    children
  );
});
