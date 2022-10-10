import { Either } from "../../lib/either";

export interface IRepository<Entity, SaveEntity, ID = string> {
  save (item: SaveEntity): Promise<Entity>;

  validate (item: SaveEntity): Promise<Either.Error<string[]> | Either.Success<Entity>>;

  update (item: Partial<SaveEntity>, uuid: ID): Promise<Either.Error<string[]> | Either.Success<Entity>>;

  delete (uuid: ID): Promise<Either.Error<string[]> | Either.Success<null>>;
}
