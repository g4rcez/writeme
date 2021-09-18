import { httpClient } from "lib/http-client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function proxyHandler(req: NextApiRequest, res: NextApiResponse<Types.ProxyResponse>) {
  if (req.method !== "POST") return;

  const init = Date.now();

  const body: Types.BodyProxy = req.body;
  try {
    const response = await httpClient({
      url: body.url,
      method: body.method ?? "GET",
      data: body.body,
      headers: body.headers,
    });

    const end = Date.now();
    return res.status(response.status).send({
      timeElapsed: end - init,
      body: response.data,
      headers: response.headers,
      statusCode: response.status,
      url: body.url,
      method: body.method,
    });
  } catch (error: any) {
    const end = Date.now();

    return res.status(500).send({
      timeElapsed: end - init,
      body: error?.response?.data ?? null,
      headers: {},
      statusCode: error?.response?.status ?? 500,
      url: body.url,
      method: body.method,
    });
  }
}
