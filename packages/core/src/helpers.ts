export namespace Helpers {
  export const head = <T>(array: T[]) => array[0];

  export const last = <T>(array: T[]) => array[array.length - 1];

  export const has = <T>(obj: T, key: keyof T | string): key is keyof T =>
    Object.prototype.hasOwnProperty.call(obj, key);

  export const uniqBy = <T>(list: T[], find: (item: T) => string | number): T[] => [
    ...new Map(list.map((x) => [find(x), x])).values(),
  ];

  export const set = <T>(obj: T, pathArray: Array<string | number>, value: any) => {
    const clone = structuredClone(obj);
    pathArray.reduce((acc, key, i) => {
      if (acc[key] === undefined) acc[key] = {};
      if (i === pathArray.length - 1) acc[key] = value;
      return acc[key];
    }, clone);
    return clone as T;
  };

  export const keys = <T extends {}>(o: T): Array<keyof T> => Object.keys(o) as never;
}
