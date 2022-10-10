import { categoriesService } from "../../../src/writeme/service/categories";
import { Either } from "../../../src/lib/either";
import { Http } from "../../../src/lib/http";

export default Http.handler({
  post: async (request) => {
    const validate = await categoriesService.validate(request.body);
    if (Either.isError(validate)) {
      return Either.error({ errors: validate.error, payload: request.body, status: Http.BadRequest });
    }
    const item = await categoriesService.save(request.body);
    return Either.success({ status: Http.Created, item });
  },
});
