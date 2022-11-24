import { IDocument } from "./interfaces/idocument";
import { ICategory } from "./interfaces/icategory";
import { CategoriesService } from "./service/categories";
import { DocumentsService } from "./service/documents";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import { Markdown } from "@writeme/markdown";
import { Domain } from "./domain";
import { Types } from "@writeme/core";
import { GetStaticPropsResult } from "next/types";

type DocumentsPageGetStaticProps = {
  categories: Domain.Category[];
  groups: Domain.CategoryDocuments[];
  mdx: Markdown.MdxProcessed;
  next: Types.Nullable<Domain.DocumentDesc>;
  post: Domain.Document;
  previous: Types.Nullable<Domain.DocumentDesc>;
};

export class WritemePages {
  public readonly category: CategoriesService;
  public readonly document: DocumentsService;

  public constructor(document: IDocument, category: ICategory) {
    this.category = new CategoriesService(category);
    this.document = new DocumentsService(document);
  }

  public documentsPageGetStaticPaths(): GetStaticPaths {
    return async () => {
      const docs = await this.document.getAllPaths();
      return {
        fallback: false,
        paths: docs.map((title) => ({ params: { title } })),
      };
    };
  }

  public documentsPageGetStaticProps(
    slug?: string,
    callback?: (
      context: GetStaticPropsContext,
      result: DocumentsPageGetStaticProps
    ) => GetStaticPropsResult<DocumentsPageGetStaticProps>
  ): GetStaticProps<DocumentsPageGetStaticProps> {
    return async (props) => {
      const title = props.params?.[slug || "title"] as string;
      try {
        const post = await this.document.getById(title);
        if (post === null) {
          return { notFound: true };
        }
        const mdx = await Markdown.process(post.content, {});
        const categories = await this.category.getAll();
        const groups = this.document.aggregate(categories, await this.document.getAll());
        const { next, previous } = this.document.getAdjacentPosts(post, groups);
        const result = { post, categories, mdx, groups, next: next, previous: previous };
        if (callback === undefined) return { props: result, revalidate: false };
        const callbackResult = (await callback(props, result)) as any;
        return { ...callbackResult, props: { ...result, ...callbackResult.props } };
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.log(error);
          throw error;
        }
        return { notFound: true };
      }
    };
  }

  public indexPageGetStaticProps(): GetStaticProps<{ categories: Domain.Category[] }> {
    return async () => {
      return {
        props: {
          categories: await this.category.getCategories(),
        },
      };
    };
  }
}
