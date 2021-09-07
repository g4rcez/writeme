import { HttpMethods } from "@g4rcez/httpsnippet";

declare global {
  export namespace Types {
    export type Dict = Partial<Record<string, string>>;

    export type BodyProxy = {
      method?: HttpMethods;
      body: any;
      headers: Types.Dict;
      url: string;
    };

    export type Hide<T, K extends keyof T> = Omit<T, K>;
  }
}
