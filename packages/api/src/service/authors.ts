import { IService } from "../interfaces/iservice";
import { Domain } from "../domain";
import { Either, Is, Strings, Types, Validator } from "@writeme/core";
import { IAuthorsRepository } from "../interfaces/authors.repository";
import { z } from "zod";

type SaveAuthor = Types.Hide<Domain.Author, "id">;

export class AuthorsService implements IService<IAuthorsRepository, SaveAuthor> {
  public schema = z.object({
    name: z.string(),
    email: z.string().email(),
    nickname: z.string(),
    links: z.array(
      z.object({
        name: z.string(),
        avatar: z.string(),
        url: z.string().url(),
      })
    ),
  });

  public editSchema = this.schema.extend({ id: z.string().uuid() });

  public constructor(public repository: IAuthorsRepository) {}

  public async delete(uuid: string): Promise<Either.Error<string[]> | Either.Success<null>> {
    const result = await this.repository.delete(uuid);
    return Is.Null(result) ? Either.success(result) : Either.error(["Error on delete author"]);
  }

  public async getAll() {
    return this.repository.getAll();
  }

  public async getAllPaths(): Promise<string[]> {
    return this.repository.getAllPaths();
  }

  public async getById(id: string) {
    return this.repository.getById(id);
  }

  public async save(entity: Domain.Author) {
    await this.repository.save(entity);
    return Either.success(entity);
  }

  public async update(entity: Domain.Author) {
    await this.repository.update(entity);
    return Either.success(entity);
  }

  public async validate(item: SaveAuthor) {
    const validation = await Validator.validate(this.schema, item);
    if (Either.isSuccess(validation)) {
      return Either.success({ ...validation.success, id: Strings.uuid() });
    }
    return Either.error(validation.error);
  }
}
