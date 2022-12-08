import { IService } from "../interfaces/iservice";
import { Domain } from "../domain";
import { Either, Strings, Types, Validator } from "@writeme/core";
import { IAuthorsRepository } from "../interfaces/authors.repository";
import { z } from "zod";

type SaveAuthor = Types.Hide<Domain.Author, "id">;

export class AuthorsService implements IService<IAuthorsRepository, SaveAuthor> {
  private schema = z.object({
    name: z.string(),
    email: z.string().email(),
    nickname: z.string(),
    links: z.array(
      z.object({
        name: z.string(),
        image: z.string(),
        url: z.string().url(),
      })
    ),
  });

  public async delete(uuid: string): Promise<Either.Error<string[]> | Either.Success<null>> {
    return Either.success(null);
  }

  public async getAll() {
    return [];
  }

  public async getAllPaths(): Promise<string[]> {
    return [];
  }

  public async getById(id: string) {
    return null;
  }

  public async save(entity: Domain.Author) {
    return Either.success(entity);
  }

  public async update(entity: Domain.Author) {
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
