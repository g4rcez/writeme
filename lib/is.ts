import { empty, has } from "ramda";

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
    has(key as string, o) as never;

  export const Empty = empty;
}
