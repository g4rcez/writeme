import { Either } from "./either";
import { z } from "zod";

export namespace Validator {
  export const validate = async <T extends z.ZodType> (schema: T, data: unknown): Promise<Either.Success<z.infer<T>>
    | Either.Error<string[]>> => {
    const result = await schema.safeParseAsync (data);
    if (result.success) {
      return Either.success (result.data);
    }
    return Either.error (result.error.issues.map ((x) => `[${x.path.join (".")}] - ${x.message}`));
  };

  export const urlFriendly = z.string ().regex (/[a-z][a-zA-Z0-9_-]+/);
}
