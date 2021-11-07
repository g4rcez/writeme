import { Database } from "db/database";
import { Strategy } from "./strategy";
import { Strings } from "./strings";

export namespace DatabaseStrategy {
  export const actions: Strategy.Document = {
    fileInfo: Database.documentContent,
    groups: () => Strategy.metadataGroups(Database.groupedDocuments, (str) => str),
    paths: async () => {
      const paths = await Database.documentPaths();
      return paths.map((x) => Strings.concatUrl(x.group.slug, x.slug).split("/"));
    },
  };
}
