import { Http } from "@writeme/api";
import { Either } from "@writeme/core";
import { writeme } from "../../../src/writeme";

export default Http.handler({
  delete: async (request) => {
    const id = request.query.id as string;
    await writeme.category.delete(id);
    return Either.success({ status: Http.Created, item: null });
  },
  patch: async (request) => {
    const payload = { ...request.body, id: request.query.id as string };
    const validate = await writeme.category.validate(payload);
    if (Either.isError(validate)) {
      return Either.error({ errors: validate.error, status: Http.BadRequest, payload });
    }
    const save = await writeme.category.update(payload, request.query.id as string);
    return Either.success({ status: Http.Created, item: save });
  },
});
