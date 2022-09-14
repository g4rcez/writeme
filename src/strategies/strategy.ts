export type FrontMatterValues = boolean | number | string | Date | FrontMatterValues[]

export type Tag = {
  id: string;
  title: string;
  url: string;
}

export type Categories = {
  id: string
  url: string;
  title: string;
}

export type Category = {}

export type FrontMatter = Record<string, FrontMatterValues>

export type MarkdownDocument = {
  url: string;
  tags: Tag[];
  title: string;
  index: number;
  content: string;
  category: string;
  createdAt: string;
  description: string;
  frontMatter: FrontMatter;
}

export abstract class Strategy {
  private name: string;

  public abstract getCategories(): Promise<Categories[]>;

  public abstract getAllDocumentPaths(): Promise<string[]>;

  public abstract getDocument(name: string): Promise<MarkdownDocument | null>;

  protected construct(name: string) {
    this.name = name;
  }

}
