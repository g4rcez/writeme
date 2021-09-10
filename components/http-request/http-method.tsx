import React from "react";

const MethodTheme: Record<string, string> = {
  DELETE: "bg-red-400",
  GET: "bg-purple-400",
  PATCH: "bg-green-400",
  POST: "bg-blue-400",
  PUT: "bg-pink-400",
};

export const HttpMethod: React.VFC<{ method?: string }> = ({
  method = "GET",
}) => {
  const text = method.toUpperCase();
  return (
    <span
      className={`http-method ${
        MethodTheme[text] ?? MethodTheme.GET
      }`}
    >
      {text}
    </span>
  );
};
