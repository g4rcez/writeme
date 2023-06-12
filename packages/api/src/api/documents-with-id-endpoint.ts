import { Either } from "@writeme/core";
import { Http } from "../http";
import { WritemePages } from "../writeme-pages";

export const documentsWithIdEndpoint = (writeme: WritemePages) =>
  Http.handler({
    put: async (req) => {
      const id = req.query.id as string;
      const result = await writeme.document.validate(req.body, writeme.document.editSchema);
      if (Either.isError(result)) {
        const error = result.error;
        return Either.error({ status: Http.BadRequest, errors: error ?? [], payload: req.body });
      }
      try {
        const saved = await writeme.document.update({ ...result.success, id });
        return Either.success({ status: Http.Created, item: saved });
      } catch (e) {
        console.error(e);
        return Either.error({ status: Http.InternalServerError, errors: [e as string], payload: req.body });
      }
    },
  });
