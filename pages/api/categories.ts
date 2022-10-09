import { NextApiRequest, NextApiResponse } from "next";
import { categoriesService } from "../../src/writeme/service/categories";
import { Either } from "../../src/lib/either";

export default async function categoriesHandler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method not allowed" });
  }
  const validate = await categoriesService.validate(request.body);
  if (Either.isError(validate)) {
    return response.status(400).json({ errors: validate.error, payload: request.body });
  }
  const save = await categoriesService.save(request.body);
  return response.status(201).json({ item: save });
}
