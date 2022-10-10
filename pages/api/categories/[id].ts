import { categoriesService } from "../../../src/writeme/service/categories";
import { Either } from "../../../src/lib/either";
import { Http } from "../../../src/lib/http";

export default Http.handler({
  delete: async (request) => {
    const id = request.query.id as string;
    await categoriesService.delete(id);
    return Either.success({ status: Http.Created, item: null });
  },
  patch: async (request) => {
    const payload = { ...request.body, id: request.query.id as string };
    const validate = await categoriesService.validate(payload);
    if (Either.isError(validate)) {
      return Either.error({ errors: validate.error, status: Http.BadRequest, payload });
    }
    const save = await categoriesService.update(payload, request.query.id as string);
    return Either.success({ status: Http.Created, item: save });
  },
});
