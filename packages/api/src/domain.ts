import { Types } from "@writeme/core";

export namespace Domain {
  export type FrontMatterValues = boolean | number | string | Date | FrontMatterValues[];

  export type FrontMatter = Record<string, FrontMatterValues>;

  type ID = string;

  export type Tag = {
    id: ID;
    title: string;
    url: string;
  };

  export type Category = {
    id: ID;
    url: string;
    title: string;
    index: number;
    icon?: string;
    banner?: string;
    description: string;
  };

  type SocialLinks = { name: string; url: string; image: string };

  export type Author = {
    id: ID;
    name: string;
    email: string;
    nickname: string;
    links: SocialLinks[];
  };

  export type Document = {
    id: string;
    url: string;
    title: string;
    index: number;
    content: string;
    category: string;
    createdAt: string;
    description: string;
    tags: Tag[];
    authors: Author[];
  };

  export type DocumentDesc = {
    index: number;
    title: string;
    category: string;
    url: string;
  };
}
