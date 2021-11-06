import { Database } from "db/database";
import matter from "gray-matter";
import { Http } from "lib/http";
import { Strings } from "lib/strings";
import { Writeme } from "lib/writeme";
import type { NextApiRequest } from "next";

type RawDocumentRequest = {
  documentId?: string;
  groupId: string;
  position: number;
  frontMatter: Array<{ name: string; value: string }>;
  markdown: string;
};

export type DocumentPutRequest = NonNullable<
  Parameters<Http.WritemeApiResponse<{ document: Database.Document | null }>["send"]>[0]
>;

const actions = {
  get: async (_req: NextApiRequest, res: Http.WritemeApiResponse<Database.Document[]>) => {
    return res.status(Http.StatusCode.Ok).json({
      items: [],
    });
  },

  put: async (req: NextApiRequest, res: Http.WritemeApiResponse<{ document: Database.Document | null }>) => {
    const body = req.body as RawDocumentRequest;
    const description = body.frontMatter.find((x) => x.name === "description")!.value;

    try {
      const section = await Database.groupById(body.groupId);

      const markdown = Strings.joinLines(
        "---",
        ...body.frontMatter.map((x) => `${x.name}: ${x.value}`),
        `section: ${section?.title}`,
        "tag: []",
        "---",
        "",
        body.markdown
      );
      const { data } = matter(markdown);

      const document: Database.UpsertDocument = {
        content: markdown,
        description,
        slug: data.slug ?? "",
        title: data.title ?? "",
        position: body.position,
      };
      const createdDocument = await Database.upsertDocument({ ...document, id: body.documentId }, section!);
      return res.status(Http.StatusCode.Created).json({ data: { document: createdDocument } });
    } catch (error) {
      console.log(error);
      return res.status(Http.StatusCode.InternalServerError).json({ data: { document: null } });
    }
  },
};

export default Writeme.apiHandler(actions);
