export type Erase<T, U extends keyof T> = Omit<T, U>;

