import React from "react";

export const Circle: React.FC<{ className?: string }> = ({ className = "bg-code" }) => (
  <span aria-hidden="true" className={`rounded-full w-3 h-3 inline-block ${className}`} />
);

export const HttpCircleStatus: React.VFC<{ status: number }> = ({ status }) => {
  if (status >= 100 && status <= 199) return <Circle className="bg-http-info" />;
  if (status >= 200 && status <= 299) return <Circle className="bg-http-success" />;
  if (status >= 300 && status <= 399) return <Circle className="bg-http-redirect" />;
  if (status >= 400 && status <= 499) return <Circle className="bg-http-client" />;
  return <Circle className="bg-http-server" />;
};
