import { httpClient } from "src/lib/http-client";
import { Http } from "../../src/lib/http";
import { Either } from "../../src/lib/either";

export default Http.handler({
  post: async (req, res) => {
    const init = Date.now();
    const body: Types.BodyProxy = req.body;
    try {
      const response = await httpClient(body.url, {
        url: body.url,
        method: body.method ?? "GET",
        data: body.body,
        headers: body.headers as any,
      });

      const end = Date.now();
      return Either.success({
        status: response.status,
        timeElapsed: end - init,
        body: response.data,
        headers: response.headers,
        statusCode: response.status,
        url: body.url,
        method: body.method,
      });
    } catch (error: any) {
      const end = Date.now();
      return Either.success({
        status: Http.InternalServerError,
        timeElapsed: end - init,
        body: error?.response?.data ?? null,
        headers: {},
        statusCode: error?.response?.status ?? 500,
        url: body.url,
        method: body.method,
      });
    }
  },
});
