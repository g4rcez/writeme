import React from "react";

type Props<T extends React.ElementType> = {
  as?: T;
} & React.ComponentPropsWithoutRef<T>;

export const Card = <T extends React.ElementType = "div">({ as, ...props }: React.PropsWithChildren<Props<T>>) => {
  const Component = as ?? "div";
  return (
    <Component
      {...props}
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-600 dark:bg-zinc-800 ${
        props.className ?? ""
      }`}
    />
  );
};
