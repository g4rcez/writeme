import React from "react";

export const Text: React.FC = ({ children }) =>
  (children && (
    <p className="my-2 antialiased text-gray-600 lining-nums tracking-wide whitespace-pre-wrap break-words w-full container mx-auto leading-relaxed">
      {children}
    </p>
  )) ||
  null;
