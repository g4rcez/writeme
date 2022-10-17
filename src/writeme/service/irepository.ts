import { Either } from "../../lib/either";
import { z } from "zod";

type ID = string;

export interface IRepository<Entity, SaveEntity, GetEntity = SaveEntity> {
  getAll(): Promise<GetEntity[]>;

  findById(id: string): Promise<Entity | null>;

  save(item: Entity): Promise<Entity>;

  validate(item: SaveEntity, schema?: z.ZodType): Promise<Either.Error<string[]> | Either.Success<Entity>>;

  update(item: Entity, uuid: ID): Promise<Either.Error<null> | Either.Success<Entity>>;

  delete(uuid: ID): Promise<Either.Error<string[]> | Either.Success<null>>;
}
