import { Document as DbDocument, Group as DbGroup, PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { Strategy } from "src/lib/strategy";
import { Strings } from "src/lib/strings";

const prisma = new PrismaClient();

export namespace Database {
  export const Client = prisma;
  export type Document = DbDocument;
  export type DocumentWithGroup = {
    group: {
      slug: string;
    };
  } & Document;
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
      return prisma.document.update({
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
    return prisma.document.create({
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
    prisma.document.findMany({
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
    description: string;
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

  export const documentById = async (id: string): Promise<DocumentWithGroup | null> => {
    const document = await prisma.document.findFirst({
      where: { id },
      select: {
        content: true,
        createdAt: true,
        description: true,
        groupId: true,
        id: true,
        position: true,
        published: true,
        slug: true,
        title: true,
        updatedAt: true,
        group: {
          select: {
            slug: true,
          },
        },
      },
    });
    return document;
  };

  export const allDocuments = async (): Promise<AllDocuments[]> => {
    const documents = await prisma.document.findMany({
      where: { published: true },
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
    const document = await prisma.document.findFirst({
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

  export const defaultGroup = async (): Promise<Group | null> => prisma.group.findFirst();
  export const groupById = async (id: string): Promise<Group | null> => prisma.group.findFirst({ where: { id } });

  export const allGroups = async () => {
    const groups = await prisma.group.findMany();
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
      return prisma.group.update({ where: { id }, data });
    }
    return prisma.group.create({ data: { ...data, createdAt: now } });
  };

  export const groupedDocuments = async (): Promise<Strategy.MetaGroups[]> => {
    const documents = await prisma.document.findMany({
      select: { slug: true, content: true, group: { select: { slug: true } } },
      where: { published: true },
    });
    return documents.map((document) => ({
      content: document.content,
      group: document.group.slug,
      path: Strings.concatUrl(document.group.slug, document.slug),
    }));
  };

  export const deleteDocument = async (id: string) => {
    await prisma.document.update({ where: { id }, data: { published: false } });
  };

  export const isAllowedUser = async (email: string) => {
    const allowed = await prisma.allowedList.findFirst({ where: { email, authorized: true } });
    return allowed?.authorized ?? false;
  };
}
