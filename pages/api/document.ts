import { Is } from "../../lib/is";
import type { NextApiRequest, NextApiResponse } from "next";
import { Http } from "lib/http";
import { WritemeDoc, WritemeSection } from "db/database";
import matter from "gray-matter";

type RawDocumentRequest = {
  documentId?: string;
  markdown: string;
};

export type DocumentPutRequest = NonNullable<
  Parameters<Http.WritemeApiResponse<{ document: WritemeDoc.Type | null }>["send"]>[0]
>;

const actions = {
  get: async (_req: NextApiRequest, res: Http.WritemeApiResponse<WritemeDoc.Type[]>) => {
    return res.status(Http.StatusCode.Ok).json({
      items: [],
    });
  },

  put: async (req: NextApiRequest, res: Http.WritemeApiResponse<{ document: WritemeDoc.Type | null }>) => {
    const doc = req.body as RawDocumentRequest;
    const { data } = matter(doc.markdown);

    try {
      const section = await WritemeSection.getDefaultSection();
      const document: WritemeDoc.Upsert = { content: doc.markdown, slug: data.slug ?? "", title: data.title ?? "" };
      const createdDocument = await WritemeDoc.upsert(document, section!);
      return res.status(Http.StatusCode.Created).json({ data: { document: createdDocument } });
    } catch (error) {
      console.log(error);
      return res.status(Http.StatusCode.InternalServerError).json({ data: { document: null } });
    }
  },
};

type Actions = keyof typeof actions;

export default function DocumentApiHandler(req: NextApiRequest, res: NextApiResponse) {
  const method: Actions = (req.method?.toLowerCase() as Actions) ?? "get";

  if (Is.Keyof(actions, method)) {
    return actions[method](req, res);
  }

  return res.status(Http.StatusCode.MethodNotAllowed);
}
