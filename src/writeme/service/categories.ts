import { Service } from "./service";
import { Categories } from "../storage/storage";
import { IRepository } from "./irepository";
import { Strings } from "../../lib/strings";
import fjs from "fluent-json-schema";
import { Regex } from "../../lib/regex";
import { Either } from "../../lib/either";
import { Validator } from "../../lib/validator";

type SaveCategories = Types.Hide<Categories, "id">;

class CategoriesService extends Service implements IRepository<Categories, SaveCategories> {
  constructor() {
    super();
    Validator.register(this.saveSchema);
  }

  public async delete(uuid: string): Promise<Either.Error<string[]> | Either.Success<null>> {
    await this.storage.delete(uuid);
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
    const list = await this.storage.fetchCategories();
    return list.sort((a, b) => a.index - b.index);
  };

  private saveSchema = Validator.createSchema(
    fjs
      .object()
      .id("categories")
      .title("Validate Categories")
      .prop("url", fjs.string().pattern(Regex.UrlFriendly))
      .prop("title", fjs.string().minLength(1))
      .prop("index", fjs.integer())
      .prop("icon", fjs.string())
      .prop("banner", fjs.string())
      .prop("description", fjs.string())
      .required(["url", "title", "index", "description"])
  );

  public async save(item: Categories): Promise<Categories> {
    const id = Strings.uuid();
    const category = { ...item, id };
    await this.storage.saveCategory(category);
    return category;
  }

  public async validate(item: SaveCategories): Promise<Either.Error<string[]> | Either.Success<Categories>> {
    const validation = Validator.validate(this.saveSchema.id, item);
    if (Either.isSuccess(validation)) {
      return Either.success({ ...item, id: Strings.uuid() });
    }
    return Either.error(validation.error.map((x) => `${x.instancePath} - ${x.message}`));
  }
}

export const categoriesService = new CategoriesService();
