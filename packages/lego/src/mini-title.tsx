import React from "react";
import type { Types } from "@writeme/core";

export const MiniTitle: React.FC<
  Types.Hide<React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>, "className">
> = ({ children, ...props }) => (
  <h3 {...props} className="mini-title">
    {children}
  </h3>
);
