import { Either } from "@writeme/core";
import { Http } from "../http";
import { WritemePages } from "../writeme-pages";

export const authorsWithIdEndpoint = (writeme: WritemePages) =>
  Http.handler({
    delete: async (req) => {
      const id = req.query.id as string;
      const deleted = await writeme.authors.delete(id);
      if (Either.isError(deleted))
        return Either.error({
          status: Http.InternalServerError,
          errors: deleted.error,
          payload: { id },
        });
      return Either.success({ status: Http.Ok, item: id });
    },
    put: async (req) => {
      const id = req.query.id as string;
      const result = await writeme.authors.validate(req.body);
      if (Either.isError(result)) {
        const error = result.error;
        return Either.error({ status: Http.BadRequest, errors: error ?? [], payload: req.body });
      }
      try {
        const saved = await writeme.authors.update({ ...result.success, id });
        return Either.success({ status: Http.Created, item: saved });
      } catch (e) {
        console.log(e);
        return Either.error({ status: Http.InternalServerError, errors: [e as string], payload: req.body });
      }
    },
  });
