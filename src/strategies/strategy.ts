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

export type Document = {
  url: string;
  tags: Tag[];
  title: string;
  index: number;
  category: string;
  createdAt: string;
  frontMatter: Record<string, FrontMatterValues>;
}

export abstract class Strategy {
  private name: string;

  public abstract getCategories(): Promise<Categories[]>;

  public abstract getAllDocumentPaths(): Promise<string[]>;

  public abstract getDocument(name: string): Promise<Document | null>;

  protected construct(name: string) {
    this.name = name;
  }

}
