import React from "react";

export const Text: React.FC = ({ children }) =>
  (children && (
    <p className="text-paragraph">
      {children}
    </p>
  )) ||
  null;
