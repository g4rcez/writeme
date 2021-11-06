import { Database } from "db/database";
import { Http } from "lib/http";
import { Writeme } from "lib/writeme";
import type { NextApiRequest, NextApiResponse } from "next";

type RawGroupRequest = {
  title: string;
  slug: string;
  position: number;
  id?: string;
};

const actions = {
  get: async (_req: NextApiRequest, res: NextApiResponse) => {
    return res.status(Http.StatusCode.Ok).json({
      items: await Database.allGroups(),
    });
  },

  put: async (req: NextApiRequest, res: Http.WritemeApiResponse<{ group: Database.Group | null }>) => {
    const body = req.body as RawGroupRequest;
    try {
      const savedGroup = await Database.upsertGroup(body.title, body.slug, body.position, body.id);
      return res.status(Http.StatusCode.Created).json({
        data: {
          group: savedGroup,
        },
      });
    } catch (error) {
      res.status(Http.StatusCode.InternalServerError).json({
        error,
      } as never);
    }
  },
};

export default Writeme.apiHandler(actions);
