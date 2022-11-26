import { Either, Types } from "@writeme/core";

type Keys = "delete" | "getAll" | "getAllPaths" | "getById" | "save" | "update";

export interface IRepository<Entity extends {} = any, EntityView extends {} = Entity>
  extends Record<Keys, (...a: any[]) => any> {
  getAll(): Promise<EntityView[]>;

  getAllPaths(): Promise<string[]>;

  getById(id: string): Promise<Entity | null>;

  save(category: Entity): Promise<Either.Success<Entity> | Either.Error<string[]>>;

  update(category: Entity): Promise<Either.Success<Entity> | Either.Error<string[]>>;

  delete(id: string): Promise<Types.Nullable<Entity>>;
}
