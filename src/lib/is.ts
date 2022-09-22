import { Helpers } from "./helpers";

export namespace Is {
  export const Json = (json: string) => {
    try {
      JSON.parse(json);
      return true;
    } catch (error) {
      return false;
    }
  };

  export const Prototype = (a: any) => Object.getPrototypeOf(a).constructor.name;

  export const NilOrEmpty = (a: any): a is undefined | null => a === null || a === undefined;

  export const Keyof = <T, K extends string>(o: T, key: K): K extends keyof T ? true : false =>
    Helpers.has(o, key as string) as never;

  export const Empty = (a: any) => {
    if (a === undefined || a === "" || a === null) return true;
    if (Array.isArray(a) && a.length === 0) return true;
    if (typeof a === "object") return Object.getPrototypeOf(a) === Object.prototype && Object.keys(a).length === 0;
    return false;
  };
}
