import { Http } from "../http";
import { Either } from "@writeme/core";
import { WritemePages } from "../writeme-pages";

export const categoriesWithIdEndpoint = (writeme: WritemePages) =>
  Http.handler({
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
      const save = await writeme.category.update(payload);
      return Either.success({ status: Http.Created, item: save });
    },
  });
