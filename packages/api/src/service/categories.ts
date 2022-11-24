import { IRepository } from "./irepository";
import { z } from "zod";
import { Types, Validator, Either, Strings } from "@writeme/core";
import { Domain } from "../domain";
import { ICategory } from "../interfaces/icategory";

type SaveCategories = Types.Hide<Domain.Category, "id">;

export class CategoriesService implements IRepository<Domain.Category, SaveCategories> {
  private saveSchema = z.object({
    title: z.string().max(256),
    index: z.number().int(),
    description: z.string(),
    banner: z.string().optional(),
    icon: z.string().optional(),
    url: Validator.urlFriendly.max(256),
  });

  constructor(public storage: ICategory) {}

  public async delete(uuid: string): Promise<Either.Error<string[]> | Either.Success<null>> {
    await this.storage.delete(uuid);
    return Either.success(null);
  }

  public async update(
    item: Partial<SaveCategories>,
    id: string
  ): Promise<Either.Error<string[]> | Either.Success<Domain.Category>> {
    const category = await this.storage.getCategoryById(id);
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
    await this.storage.update(updated);
    return Either.success(updated);
  }

  public getCategories = async (): Promise<Domain.Category[]> => {
    const list = await this.storage.getCategories();
    return list.sort((a, b) => a.index - b.index);
  };

  public async save(item: Domain.Category): Promise<Domain.Category> {
    const id = Strings.uuid();
    const category = { ...item, id };
    await this.storage.save(category);
    return category;
  }

  public async validate(item: SaveCategories): Promise<Either.Error<string[]> | Either.Success<Domain.Category>> {
    const validation = await Validator.validate(this.saveSchema, item);
    if (Either.isSuccess(validation)) {
      return Either.success({ ...validation.success, id: Strings.uuid() });
    }
    return Either.error(validation.error);
  }

  public async getAll(): Promise<Domain.Category[]> {
    return this.storage.getCategories();
  }

  public async findById(id: string): Promise<Domain.Category | null> {
    return null;
  }
}
