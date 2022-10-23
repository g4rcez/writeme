import { Strings } from "./strings";
import { Helpers } from "./helpers";

type Builder = string | ((...args: any[]) => string);

const trimUrl = (str: string) => str.replace(/\/+$/g, "");

const join = (base: string, ...paths: string[]) =>
  paths.reduce((acc, el) => trimUrl(acc) + "/" + el.replace(/^\/+/g, ""), base);

const createGroup = <T extends Record<string, Builder>>(prefix: `/${string}`, group: T) => {
  return Helpers.keys(group).reduce<T>((acc, el) => {
    const element = group[el];
    const result =
      typeof element === "function"
        ? (...args: any) => trimUrl(`${join(prefix, element(...args))}`)
        : trimUrl(join(prefix, element));
    return { ...acc, [el]: result };
  }, {} as T);
};

export const Links = {
  toDoc: (...paths: string[]) => Strings.concatUrl("/docs", ...paths),
  dashboard: createGroup("/dashboard", {
    document: (id: string) => `/documents/${id}`,
    new: "/new",
    documentRoot: "/documents",
  }),
} as const;
