export namespace Helpers {
  export const head = <T>(array: T[]) => array[0];
  export const last = <T>(array: T[]) => array[array.length - 1];

  export const has = <T>(obj: T, key: keyof T | string): key is keyof T =>
    Object.prototype.hasOwnProperty.call(obj, key);

  export const uniqBy = <T>(list: T[], find: (item: T) => string | number): T[] => {
    const map = new Map<string | number, T>();
    list.forEach((x) => {
      const key = find(x);
      if (map.has(key)) return;
      map.set(key, x);
    });
    return [...map.values()];
  };
}
