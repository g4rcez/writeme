import { Service } from "./service";
import { Categories } from "../storage/storage";
import { IRepository } from "./irepository";
import { Strings } from "../../lib/strings";
import { Either } from "../../lib/either";
import { Validator } from "../../lib/validator";

import { z } from "zod";

type SaveCategories = Types.Hide<Categories, "id">;

class CategoriesService extends Service implements IRepository<Categories, SaveCategories> {
  public async delete(uuid: string): Promise<Either.Error<string[]> | Either.Success<null>> {
    await this.storage.deleteCategory(uuid);
    return Either.success(null);
  }

  public async update(
    item: Partial<SaveCategories>,
    id: string
  ): Promise<Either.Error<string[]> | Either.Success<Categories>> {
    const category = await this.storage.getCategory(id);
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
    await this.storage.updateCategory(updated);
    return Either.success(updated);
  }

  public getCategories = async (): Promise<Categories[]> => {
    const list = await this.storage.getCategories();
    return list.sort((a, b) => a.index - b.index);
  };

  private saveSchema = z.object({
    title: z.string().max(256),
    index: z.number().int(),
    description: z.string(),
    banner: z.string().optional(),
    icon: z.string().optional(),
    url: Validator.urlFriendly.max(256),
  });

  public async save(item: Categories): Promise<Categories> {
    const id = Strings.uuid();
    const category = { ...item, id };
    await this.storage.saveCategory(category);
    return category;
  }

  public async validate(item: SaveCategories): Promise<Either.Error<string[]> | Either.Success<Categories>> {
    const validation = await Validator.validate(this.saveSchema, item);
    if (Either.isSuccess(validation)) {
      return Either.success({ ...validation.success, id: Strings.uuid() });
    }
    return Either.error(validation.error);
  }
}

export const categoriesService = new CategoriesService();
