import { Http } from "../../../src/lib/http";
import { postsService } from "../../../src/writeme/service/documents";
import { Either } from "../../../src/lib/either";

export default Http.handler({
  post: async (req) => {
    const result = await postsService.validate(req.body);
    if (Either.isError(result)) {
      const error = result.error;
      return Either.error({ status: Http.BadRequest, errors: error ?? [], payload: req.body });
    }
    try {
      const saved = await postsService.save(result.success as never);
      return Either.success({ status: Http.Created, item: saved });
    } catch (e) {
      console.log(e);
      return Either.error({ status: Http.InternalServerError, errors: [e as string], payload: req.body });
    }
  },
});
