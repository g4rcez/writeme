import { z } from "zod";
import { Either } from "@writeme/core";
import { IRepository } from "./irepository";

// @ts-ignore
type Extract<T extends IRepository, K extends keyof T> = ReturnType<T[K]>;

export interface IService<T extends IRepository = any, SaveEntity extends {} = any> {
  getAll(): Extract<T, "getAll">;

  getAllPaths(): Promise<string[]>;

  getById(id: string): Extract<T, "getById">;

  save(entity: Parameters<T["save"]>[0]): Extract<T, "save">;

  validate(item: SaveEntity, schema?: z.ZodType): Extract<IRepository, "save">;

  update(item: Parameters<IRepository["update"]>[0]): Extract<IRepository, "update">;

  delete(uuid: Parameters<IRepository["delete"]>[0]): Promise<Either.Error<string[]> | Either.Success<null>>;
}
