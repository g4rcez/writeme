import { ArraySchema, ObjectSchema } from "fluent-json-schema";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { Either } from "./either";

export namespace Validator {
  const ajv = new Ajv({ allErrors: true, allowDate: true, allowMatchingProperties: true });
  addFormats(ajv);

  export const get = (id: string) => ajv.getSchema(id)!;

  export const createSchema = (schema: ObjectSchema | ArraySchema) => {
    const value: any = schema.valueOf();
    return { schema: value, id: value["$id"] };
  };

  export const register = (input: ReturnType<typeof createSchema>) => ajv.addSchema(input.schema, input.id);

  export const validate = <T>(id: string, data: T) => {
    const validator = get(id);
    const result = validator(data);
    if (result) {
      return Either.success(data);
    }
    return Either.error(validator.errors ?? []);
  };
}
