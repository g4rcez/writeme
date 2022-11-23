import React from "react";

export const MethodTheme: Record<string, string> = {
  DELETE: "bg-red-600",
  GET: "bg-blue-500",
  PATCH: "bg-cyan-500",
  POST: "bg-indigo-500",
  PUT: "bg-violet-500",
  OPTIONS: "bg-pink-500",
  HEAD: "bg-fuchsia-500",
};

export const HttpMethod: React.FC<{ method?: string }> = ({ method = "GET" }) => {
  const text = method.toUpperCase();
  return (
    <span className={`http-method rounded-full text-main-accent px-2 py-1 ${MethodTheme[text] ?? MethodTheme.GET}`}>
      {text}
    </span>
  );
};
