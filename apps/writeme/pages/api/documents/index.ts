import { Http } from "@writeme/api";
import { postsService } from "@writeme/api";
import { Either } from "@writeme/core";

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
