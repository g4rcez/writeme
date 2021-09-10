import { httpClient } from "lib/http-client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function proxyHandler(req: NextApiRequest, res: NextApiResponse<Types.ProxyResponse>) {
  if (req.method !== "POST") return;
  const body: Types.BodyProxy = req.body;
  const response = await httpClient({
    url: body.url,
    method: body.method ?? "GET",
    data: body.body,
    headers: body.headers,
  });
  Object.keys(response.headers).map((x) => {
    res.setHeader(x, response.headers[x]);
  });
  return res.status(response.status).send({
    body: response.data,
    headers: response.headers,
    statusCode: response.status,
    url: body.url,
    method: body.method,
  });
}
