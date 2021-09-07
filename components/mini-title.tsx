import React from "react";

export const MiniTitle: React.FC<
  Types.Hide<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLHeadingElement>,
      HTMLHeadingElement
    >,
    "className"
  >
> = ({ children, ...props }) => (
  <h3 {...props} className="uppercase mb-2 text-sm font-bold text-gray-500">
    {children}
  </h3>
);
