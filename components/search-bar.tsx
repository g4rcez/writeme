import React from "react";

type Props = {
  show: boolean;
};

export const SearchBar: React.VFC<Props> = ({ show }) => {
  if (!show) return null;
  return (
    <div className="wall fixed top-0 left-0 bg-transparent h-screen w-screen">
      <div className="wall-overlay"></div>
    </div>
  );
};
