import React from "react";

const MethodTheme: Record<string, string> = {
  DELETE: "bg-http-delete",
  GET: "bg-http-get",
  PATCH: "bg-http-patch",
  POST: "bg-http-post",
  PUT: "bg-http-put",
};

export const HttpMethod: React.VFC<{ method?: string }> = ({ method = "GET" }) => {
  const text = method.toUpperCase();
  return <span className={`http-method ${MethodTheme[text] ?? MethodTheme.GET}`}>{text}</span>;
};
