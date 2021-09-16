import React from "react";

export const Circle: React.VFC<{ className?: string }> = ({ className = "bg-black" }) => (
  <span aria-hidden="true" className={`rounded-full w-3 h-3 inline-block ${className}`} />
);

export const HttpCircleStatus: React.VFC<{ status: number }> = ({ status }) => {
  if (status >= 100 && status <= 199) return <Circle className="bg-blue-400" />;
  if (status >= 200 && status <= 299) return <Circle className="bg-green-400" />;
  if (status >= 300 && status <= 399) return <Circle className="bg-indigo-400" />;
  if (status >= 400 && status <= 499) return <Circle className="bg-yellow-500" />;
  return <Circle className="bg-red-500" />;
};
