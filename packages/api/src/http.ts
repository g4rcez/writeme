import { NextApiRequest, NextApiResponse } from "next";
import { Either, Helpers } from "@writeme/core";

export namespace Http {
  export const InternalServerError = 500;
  export const MethodNotAllowed = 405;
  export const Ok = 200;
  export const Created = 201;
  export const BadRequest = 400;

  export enum Method {
    get = "get",
    delete = "delete",
    put = "put",
    post = "post",
    patch = "patch",
  }

  type WritemeResponse =
    | Either.Success<{ status: number; items: any[] } | { status: number; item: any } | ({ status: number } & object)>
    | Either.Error<{ errors: string[]; payload: any; status: number }>;

  type Handlers = Partial<Record<Method, (req: NextApiRequest, res: NextApiResponse) => Promise<WritemeResponse>>>;

  export const handler = (handlers: Handlers) => async (req: NextApiRequest, res: NextApiResponse) => {
    const method = (req.method?.toLowerCase() as Method) ?? "get";
    const hasMethod = Helpers.has(handlers, method as Method);
    if (!hasMethod) {
      return res.status(405).json({ message: "Method not allowed" });
    }
    const result = await handlers[method]!(req, res);
    if (Either.isError(result)) {
      const error = result.error;
      return res.status(error.status).json({ payload: error.payload, errors: error.errors });
    }
    const success = result.success;
    const { status, ...other } = success;
    return res.status(status).json(other);
  };
}
