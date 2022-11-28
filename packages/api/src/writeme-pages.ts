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

type DocumentsByIdPageGetStaticProps = {
  document: Types.Nullable<Domain.Document>;
};

export class WritemePages {
  public readonly category: CategoriesService;
  public readonly document: DocumentsService;

  public constructor(args: { categoryService: CategoriesService; documentsService: DocumentsService }) {
    this.category = args.categoryService;
    this.document = args.documentsService;
  }

  public documentsPageGetStaticPaths(fileNameParam: string = "title"): GetStaticPaths {
    return async () => {
      const docs = await this.document.getAllPaths();
      return { fallback: false, paths: docs.map((title) => ({ params: { [fileNameParam]: title } })) };
    };
  }

  public async refactor<T>(
    result: T,
    props: GetStaticPropsContext,
    callback?: (context: GetStaticPropsContext, result: T) => GetStaticPropsResult<T>
  ) {
    if (callback === undefined) return { props: result, revalidate: false };
    const callbackResult = (await callback(props, result)) as any;
    return { ...callbackResult, props: { ...result, ...callbackResult.props } };
  }

  public documentsByIdPageGetStaticProps(
    fileNameParam: string,
    callback?: (
      context: GetStaticPropsContext,
      result: DocumentsByIdPageGetStaticProps
    ) => GetStaticPropsResult<DocumentsByIdPageGetStaticProps>
  ): GetStaticProps<DocumentsByIdPageGetStaticProps> {
    return async (props) => {
      const id = props.params?.[fileNameParam || "id"] as string;
      try {
        const result: DocumentsByIdPageGetStaticProps = { document: await this.document.getById(id) };
        return this.refactor(result, props, callback);
      } catch (e) {
        console.log("ERROR", e);
        return { notFound: true };
      }
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
        return this.refactor(result, props, callback);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.log(error);
          throw error;
        }
        return { notFound: true };
      }
    };
  }

  public getAllCategoriesStaticProps(): GetStaticProps<{ categories: Domain.Category[] }> {
    return async () => ({ props: { categories: await this.category.getAll() } });
  }

  public indexDashboardPagesGetStaticProps(): GetStaticProps<{ categories: Domain.DocumentDesc[] }> {
    return async () => ({ props: { categories: await this.document.getAll() } });
  }
}
