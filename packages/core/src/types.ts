export namespace Types {
  export type Nullable<T> = T | null;

  export type Dict = Partial<Record<string, string>>;

  export type HttpMethods = "GET" | "POST" | "PATCH" | "PUT" | "DELETE" | "HEAD" | "OPTIONS";

  export type BodyProxy = {
    method?: HttpMethods;
    body: any;
    headers: Types.Dict;
    url: string;
  };

  export type Hide<T, K extends keyof T> = Omit<T, K>;

  export type Only<T, K extends keyof T> = Pick<T, K>;

  export type Autocomplete<T extends string> = T | Omit<string, T>;

  export type KeyString<T> = Omit<T, number | symbol>;
}
