import { IStorage } from "../storage/storage";
import { storage } from "../storage/main.storage";

export abstract class Service {
  public storage: IStorage = storage;

  public constructor() {}
}
