import { z } from "zod";
import { Either } from "./either";

export namespace Validator {
  export const validate = async <T extends z.ZodType>(
    schema: T,
    data: unknown
  ): Promise<Either.Success<NonNullable<z.infer<T>>> | Either.Error<string[]>> => {
    const result = await schema.safeParseAsync(data);
    if (result.success) {
      return Either.success(result.data);
    }
    return Either.error(result.error.issues.map((x) => `[${x.path.join(".")}] - ${x.message}`));
  };

  export const urlFriendly = z.string().regex(/[a-z][a-zA-Z0-9_-]+/);

  export const date = z.preprocess((val) => (typeof val === "string" ? new Date(val) : val), z.date());
}
