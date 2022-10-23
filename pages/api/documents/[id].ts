import { Http } from "../../../src/lib/http";
import { postsService } from "../../../src/writeme/service/documents";
import { Either } from "../../../src/lib/either";

export default Http.handler({
  put: async (req) => {
    const id = req.query.id as string;
    const result = await postsService.validate(req.body, postsService.editSchema);
    if (Either.isError(result)) {
      const error = result.error;
      return Either.error({ status: Http.BadRequest, errors: error ?? [], payload: req.body });
    }
    try {
      const saved = await postsService.update(result.success as never, id);
      return Either.success({ status: Http.Created, item: saved });
    } catch (e) {
      console.log(e);
      return Either.error({ status: Http.InternalServerError, errors: [e as string], payload: req.body });
    }
  },
});
