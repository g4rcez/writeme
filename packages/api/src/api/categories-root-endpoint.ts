import { WritemePages } from "../writeme-pages";
import { Http } from "../http";
import { Either } from "@writeme/core";

export const categoriesRootEndpoint = (writeme: WritemePages) =>
  Http.handler({
    post: async (request) => {
      const validate = await writeme.category.validate(request.body);
      if (Either.isError(validate)) {
        return Either.error({ errors: validate.error, payload: request.body, status: Http.BadRequest });
      }
      const item = await writeme.category.save(request.body);
      return Either.success({ status: Http.Created, item });
    },
  });
