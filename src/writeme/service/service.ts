import { Storage } from "../storage/storage";
import { storage } from "../storage/main.storage";

export abstract class Service {
  public storage: Storage = storage;

  public constructor() {}
}
