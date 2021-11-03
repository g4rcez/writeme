import { Document, PrismaClient, Section } from "@prisma/client";
import { randomUUID } from "crypto";

const client = new PrismaClient();

export namespace WritemeSection {
  export const getDefaultSection = async (): Promise<Section | null> => {
    const result = await client.section.findFirst();
    return result;
  };
}

export namespace WritemeDoc {
  export type Upsert = {
    id?: string;
    title: string;
    content: string;
    slug: string;
  };

  export type Type = Document;

  export const upsert = async (doc: Upsert, section: Section) => {
    const uuid = randomUUID();
    const now = new Date().toISOString();

    if (doc.id) {
      const updated = await client.document.update({
        where: {
          id: doc.id,
        },
        data: {
          content: doc.content,
          slug: doc.slug,
          title: doc.title,
          id: doc.id,
          published: true,
          updatedAt: now,
          sectionId: section.id,
        },
      });
      return updated;
    }
    const data = {
      content: doc.content,
      slug: doc.slug,
      title: doc.title,
      id: uuid,
      createdAt: now,
      published: true,
      updatedAt: now,
      sectionId: section.id,
    };
    const result = await client.document.create({ data });
    return result;
  };

  export const getAllForStaticPaths = async () => {
    const documents = await client.document.findMany({
      select: {
        content: false,
        createdAt: true,
        section: true,
        slug: true,
        title: false,
        id: false,
        updatedAt: false,
        sectionId: false,
      },
      where: {
        published: true,
      },
    });
    return documents;
  };
}
