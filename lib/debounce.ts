export type Fn = (...a: any[]) => any;

export function debounce<T extends Fn>(fn: T, ms = 2000) {
  let id: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(id);
    //@ts-ignore
    id = setTimeout(() => fn.apply(this, args), ms);
  };
}
