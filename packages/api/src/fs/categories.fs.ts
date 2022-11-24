import { Domain } from "../domain";
import { parse as ymlParse } from "yaml";
import { FsPlugin } from "./fs.plugin";
import { ICategory } from "../interfaces/icategory";

export class Category extends FsPlugin implements ICategory {
  private getCategoriesContent(): Domain.Category[] {
    const text = this.openFile(this.categoryFile);
    return ymlParse(text);
  }

  public async getAllPaths(): Promise<string[]> {
    const content = this.getCategoriesContent();
    return content.map((x) => x.url);
  }

  public async getCategories(): Promise<Domain.Category[]> {
    return this.getCategoriesContent().map(
      (x): Domain.Category => ({
        id: x.id || x.url,
        url: x.url,
        icon: x.icon ?? "",
        title: x.title,
        index: x.index,
        banner: x.banner ?? "",
        description: x.description ?? "",
      })
    );
  }

  public async delete(id: string): Promise<boolean> {
    const categories = await this.getCategories();
    this.writeCategory(categories.filter((x) => x.id !== id));
    return true;
  }

  public async update(category: Domain.Category): Promise<void> {
    const categories = await this.getCategories();
    const newCategories = categories.map((x) => (x.id === category.id ? category : x));
    this.writeCategory(newCategories);
  }

  public async getCategoryById(id: string): Promise<Domain.Category | null> {
    const text = this.openFile(this.categoryFile);
    const yml = ymlParse(text);
    return yml.find((x: any) => x.id === id) ?? null;
  }

  public async save(category: Domain.Category): Promise<void> {
    const categories = await this.getCategories();
    categories.push(category);
    this.writeCategory(categories);
  }
}
