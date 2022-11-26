import { IService } from "../interfaces/iservice";
import { z } from "zod";
import { Types, Validator, Either, Strings } from "@writeme/core";
import { Domain } from "../domain";
import { ICategoryRepository } from "../interfaces/category-repository";
import { IRepository } from "../interfaces/irepository";

type SaveCategories = Types.Hide<Domain.Category, "id">;

export class CategoriesService implements IService<ICategoryRepository, SaveCategories> {
  private saveSchema = z.object({
    title: z.string().max(256),
    index: z.number().int(),
    description: z.string(),
    banner: z.string().optional(),
    icon: z.string().optional(),
    url: Validator.urlFriendly.max(256),
  });

  constructor(public repository: ICategoryRepository) {}

  public async delete(uuid: string): Promise<Either.Error<string[]> | Either.Success<null>> {
    await this.repository.delete(uuid);
    return Either.success(null);
  }

  public async update(item: Domain.Category) {
    const id = item.id;
    const category = await this.repository.getById(id);
    if (category === null) {
      throw new Error("This category not exist.");
    }
    const updated = {
      id,
      index: item.index ?? category.index,
      title: item.title ?? category.title,
      url: item.url ?? category.url,
      description: item.description ?? category.description,
      banner: item.banner ?? category.banner,
      icon: item.icon ?? category.icon,
    };
    await this.repository.update(updated);
    return Either.success(updated);
  }

  public getCategories = async (): Promise<Domain.Category[]> => {
    const list = await this.repository.getAll();
    return list.sort((a, b) => a.index - b.index);
  };

  public async save(item: Domain.Category) {
    const id = Strings.uuid();
    const category = { ...item, id };
    return this.repository.save(category);
  }

  public async validate(item: SaveCategories): Promise<Either.Error<string[]> | Either.Success<Domain.Category>> {
    const validation = await Validator.validate(this.saveSchema, item);
    if (Either.isSuccess(validation)) {
      return Either.success({ ...validation.success, id: Strings.uuid() });
    }
    return Either.error(validation.error);
  }

  public async getAll(): Promise<Domain.Category[]> {
    return this.repository.getAll();
  }

  public async getById(id: string): Promise<Domain.Category | null> {
    return this.repository.getById(id);
  }

  public getAllPaths(): Promise<string[]> {
    return this.repository.getAllPaths();
  }
}
