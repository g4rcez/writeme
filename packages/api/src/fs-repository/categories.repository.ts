import { parse as ymlParse, stringify as ymlStringify } from "yaml";
import { FsPlugin } from "./fs.plugin";
import { Either } from "@writeme/core";
import { ICategoriesRepository } from "../interfaces/categories.repository";
import { Domain } from "../domain";
import fs from "fs";

export class Category extends FsPlugin implements ICategoriesRepository {
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

  public async delete(id: string) {
    const categories = await this.getCategories();
    const category = categories.find((x) => x.id === id) ?? null;
    if (category === null) return null;
    const newList = categories.filter((x) => x.id !== id);
    this.writeCategory(newList);
    return category;
  }

  public async update(category: Domain.Category) {
    const categories = await this.getCategories();
    const newCategories = categories.map((x) => (x.id === category.id ? category : x));
    this.writeCategory(newCategories);
    return Either.success(category);
  }

  public async save(category: Domain.Category) {
    const categories = await this.getCategories();
    categories.push(category);
    this.writeCategory(categories);
    return Either.success(category);
  }

  public getAll(): Promise<Domain.Category[]> {
    return Promise.resolve(this.getCategoriesContent());
  }

  public async getById(id: string): Promise<Domain.Category | null> {
    return this.getCategoriesContent().find((x) => x.id === id) ?? null;
  }

  private writeCategory(yaml: Domain.Category[]) {
    return fs.writeFileSync(this.categoryFile, ymlStringify(yaml));
  }

  private getCategoriesContent(): Domain.Category[] {
    const text = this.openFile(this.categoryFile);
    const categories: Domain.Category[] = ymlParse(text);
    return categories.sort((a, b) => a.index - b.index);
  }
}
