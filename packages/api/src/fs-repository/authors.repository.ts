import { FsPlugin } from "./fs.plugin";
import { IAuthorsRepository } from "../interfaces/authors.repository";
import { Domain } from "../domain";
import { Either, Types } from "@writeme/core";
import { parse as ymlParse } from "yaml";

export class Authors extends FsPlugin implements IAuthorsRepository {
  public async delete(id: string): Promise<Types.Nullable<Domain.Author>> {
    const authors = this.getAuthorsContent();
    this.writeFile(this.authorsFile, JSON.stringify(authors.filter((x) => x.id !== id)));
    return null;
  }

  public async getAll(): Promise<Domain.Author[]> {
    const authors = this.getAuthorsContent();
    return Promise.resolve(authors);
  }

  public async getAllPaths(): Promise<string[]> {
    const authors = this.getAuthorsContent();
    return Promise.resolve(authors.map((x) => x.id));
  }

  public async getById(id: string): Promise<Domain.Author | null> {
    const authors = this.getAuthorsContent();
    return authors.find((x) => id === x.nickname) ?? null;
  }

  public async save(entity: Domain.Author): Promise<Either.Success<Domain.Author> | Either.Error<string[]>> {
    const authors = this.getAuthorsContent();
    const merge = authors.concat(entity);
    this.writeFile(this.authorsFile, JSON.stringify(merge));
    return Either.success(entity);
  }

  public async update(entity: Domain.Author): Promise<Either.Success<Domain.Author> | Either.Error<string[]>> {
    const updated = this.getAuthorsContent().map((x) => (x.id === entity.id ? entity : x));
    this.writeFile(this.authorsFile, JSON.stringify(updated));
    return Either.success(entity);
  }

  private getAuthorsContent(): Domain.Author[] {
    const text = this.openFile(this.authorsFile);
    const authors: Domain.Author[] = ymlParse(text);
    return authors.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  }
}
