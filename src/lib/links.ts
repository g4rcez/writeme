import { Strings } from "./strings";

export const Links = {
  toDoc: (...paths: string[]) => Strings.concatUrl("/docs", ...paths),
} as const;
