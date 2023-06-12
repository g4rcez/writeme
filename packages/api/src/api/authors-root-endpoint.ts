import { WritemePages } from "../writeme-pages";
import { Http } from "../http";
import { Either } from "@writeme/core";

export const authorsRootEndpoint = (writeme: WritemePages) =>
  Http.handler({
    post: async (req) => {
      const result = await writeme.authors.validate(req.body);
      if (Either.isError(result)) {
        const error = result.error;
        return Either.error({ status: Http.BadRequest, errors: error ?? [], payload: req.body });
      }
      try {
        const saved = await writeme.authors.save(result.success as never);
        return Either.success({ status: Http.Created, item: saved });
      } catch (e) {
        console.error(e);
        return Either.error({ status: Http.InternalServerError, errors: [e as string], payload: req.body });
      }
    },
  });
