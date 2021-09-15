import { httpClient } from "lib/http-client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function proxyHandler(req: NextApiRequest, res: NextApiResponse<Types.ProxyResponse>) {
  if (req.method !== "POST") return;

  const init = Date.now();

  const body: Types.BodyProxy = req.body;
  const response = await httpClient({
    url: body.url,
    method: body.method ?? "GET",
    data: body.body,
    headers: body.headers,
  });

  const end = Date.now();

  Object.keys(response.headers).map((x) => {
    res.setHeader(x, response.headers[x]);
  });
  return res.status(response.status).send({
    timeElapsed: end - init,
    body: response.data,
    headers: response.headers,
    statusCode: response.status,
    url: body.url,
    method: body.method,
  });
}
