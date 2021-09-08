import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function proxyHandler(req: NextApiRequest, res: NextApiResponse<Types.ProxyResponse>) {
  if (req.method !== "POST") return;
  const body: Types.BodyProxy = req.body;
  const response = await axios({
    url: body.url,
    method: body.method ?? "GET",
    data: body.body,
    headers: body.headers,
  });
  Object.keys(response.headers).map((x) => {
    res.setHeader(x, response.headers[x]);
  });
  return res
    .status(response.status)
    .send({
      body: response.data,
      headers: response.headers,
      statusCode: response.status,
      url: body.url,
      method: body.method,
    });
}
