import { Document as DbDocument, PrismaClient, Group as DbGroup } from "@prisma/client";
import { randomUUID } from "crypto";
import { Strings } from "lib/strings";
import { Writeme } from "lib/writeme";

const client = new PrismaClient();

export namespace Database {
  export type Document = DbDocument;
  export type Group = DbGroup;
  export type UpsertDocument = {
    description: string;
    position: number;
    id?: string;
    title: string;
    content: string;
    slug: string;
  };

  export const upsertDocument = async (doc: UpsertDocument, group: Group) => {
    const uuid = randomUUID();
    const now = new Date().toISOString();

    if (doc.id) {
      return client.document.update({
        where: { id: doc.id },
        data: {
          description: doc.description,
          content: doc.content,
          slug: doc.slug,
          title: doc.title,
          id: doc.id,
          published: true,
          updatedAt: now,
          groupId: group.id,
        },
      });
    }
    return client.document.create({
      data: {
        description: doc.description,
        position: doc.position,
        content: doc.content,
        slug: doc.slug,
        title: doc.title,
        id: uuid,
        createdAt: now,
        published: true,
        updatedAt: now,
        groupId: group.id,
      },
    });
  };

  export const documentPaths = async () =>
    client.document.findMany({
      select: {
        content: false,
        createdAt: true,
        group: true,
        slug: true,
        title: false,
        id: false,
        updatedAt: false,
        groupId: false,
      },
      where: {
        published: true,
      },
    });

  export type AllDocuments = {
    description: string
    position: number;
    slug: string;
    title: string;
    id: string;
    group: {
      slug: string;
      title: string;
      position: number;
    };
  };

  export const documentById = async (id: string) => {
    const document = await client.document.findFirst({ where: { id } });
    return document;
  };

  export const allDocuments = async (): Promise<AllDocuments[]> => {
    const documents = await client.document.findMany({
      select: {
        description: true,
        content: false,
        position: true,
        slug: true,
        title: true,
        id: true,
        group: {
          select: {
            slug: true,
            title: true,
            position: true,
          },
        },
      },
    });
    return documents;
  };

  export const documentContent = async (path: string) => {
    const [section, ...slug] = path.split("/");
    const documentSlug = slug.join("/");
    const document = await client.document.findFirst({
      where: {
        group: {
          slug: section,
        },
        slug: documentSlug,
      },
      select: {
        content: true,
        updatedAt: true,
        createdAt: true,
      },
    });
    if (document === null) {
      throw new Error("Document empty");
    }
    return document;
  };

  export const defaultGroup = async (): Promise<Group | null> => client.group.findFirst();
  export const groupById = async (id: string): Promise<Group | null> => client.group.findFirst({ where: { id } });

  export const allGroups = async () => {
    const groups = await client.group.findMany();
    return groups.map((group) => ({
      ...group,
      createdAt: group.createdAt.toISOString(),
      updatedAt: group.updatedAt.toISOString(),
    }));
  };

  export const upsertGroup = (title: string, slug: string, position: number, id?: string) => {
    const now = new Date().toISOString();
    const data = { slug, title, updatedAt: now, position };
    if (id) {
      return client.group.update({ where: { id }, data });
    }
    return client.group.create({ data: { ...data, createdAt: now } });
  };

  export const groupedDocuments = async (): Promise<Writeme.MetaGroups[]> => {
    const documents = await client.document.findMany({
      select: { slug: true, content: true, group: { select: { slug: true } } },
    });
    return documents.map((document) => ({
      content: document.content,
      group: document.group.slug,
      path: Strings.concatUrl(document.group.slug, document.slug),
    }));
  };
}
