import { NextApiResponse } from "next";
export namespace Http {
  export enum StatusCode {
    InternalServerError = 500,
    MethodNotAllowed = 405,
    Ok = 200,
    Created = 201,
  }

  export enum Method {
    get = "get",
    put = "put",
  }

  export type WritemeApiResponse<T> = T extends Array<any>
    ? NextApiResponse<{ items: T }>
    : NextApiResponse<{ data: T }>;
}
