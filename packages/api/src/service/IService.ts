import { z } from "zod";
import { Either } from "@writeme/core";

type ID = string;

export interface IService<Entity, SaveEntity, GetEntity = SaveEntity> {
  getAll(): Promise<GetEntity[]>;

  getAllPaths(): Promise<string[]>;

  getById(id: string): Promise<Entity | null>;

  save(item: Entity): Promise<Entity>;

  validate(item: SaveEntity, schema?: z.ZodType): Promise<Either.Error<string[]> | Either.Success<Entity>>;

  update(item: Entity, uuid: ID): Promise<Either.Error<string[]> | Either.Success<Entity>>;

  delete(uuid: ID): Promise<Either.Error<string[]> | Either.Success<null>>;
}
