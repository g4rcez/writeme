import { structuredClone } from "next/dist/compiled/@edge-runtime/primitives/structured-clone";

export namespace Helpers {
  export const head = <T>(array: T[]) => array[0];

  export const last = <T>(array: T[]) => array[array.length - 1];

  export const has = <T>(obj: T, key: keyof T | string): key is keyof T =>
    Object.prototype.hasOwnProperty.call(obj, key);

  export const uniqBy = <T>(list: T[], find: (item: T) => string | number): T[] => {
    const map = new Map<string | number, T>();
    list.forEach((x) => {
      const key = find(x);
      return map.has(key) ? undefined : map.set(key, x);
    });
    return [...map.values()];
  };

  export const set = <T>(obj: T, pathArray: Array<string | number>, value: any) => {
    const clone = structuredClone(obj);
    pathArray.reduce((acc, key, i) => {
      if (acc[key] === undefined) acc[key] = {};
      if (i === pathArray.length - 1) acc[key] = value;
      return acc[key];
    }, clone as any);
    return clone as T;
  };

  export const keys = <T extends {}>(o: T): Array<keyof T> => Object.keys(o) as never;
}
