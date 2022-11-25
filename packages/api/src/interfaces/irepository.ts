import { Either, Types } from "@writeme/core";

export interface IRepository<Entity, EntityView = Entity> {
  delete (id: string): Promise<Types.Nullable<Entity>>;

  getAllPaths (): Promise<string[]>;

  getAll (): Promise<EntityView[]>;

  getById (id: string): Promise<Entity | null>;

  save (category: Entity): Promise<Either.Success<Entity> | Either.Error<string[]>>;

  update (category: Entity): Promise<Either.Success<Entity> | Either.Error<string[]>>;
}
