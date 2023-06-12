import type { NextApiRequest, NextApiResponse } from "next";

export default async function proxyHandler(req: NextApiRequest, res: NextApiResponse) {
  const status = Number.parseInt(req.query.status as string, 10) || 200;
  return res.status(status).send({
    method: req.method,
    body: req.body,
    url: req.url,
    status: req.query.status,
  });
}
