import { Http } from "@writeme/api";
import { Either } from "@writeme/core";
import { writeme } from "../../../src/writeme";

export default Http.handler({
  post: async (request) => {
    const validate = await writeme.category.validate(request.body);
    if (Either.isError(validate)) {
      return Either.error({ errors: validate.error, payload: request.body, status: Http.BadRequest });
    }
    const item = await writeme.category.save(request.body);
    return Either.success({ status: Http.Created, item });
  },
});
