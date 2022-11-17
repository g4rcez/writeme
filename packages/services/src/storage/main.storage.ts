import { FsStorage } from "./fs.storage";
import { Config, Helpers } from "@writeme/core";
import { IStorage } from "./storage";

const Strategies = {
  fs: FsStorage,
};

export const storage = ((): IStorage => {
  const providedStrategy = Config.properties?.strategy ?? "fs";
  if (Helpers.has(Strategies, providedStrategy)) {
    return new Strategies[providedStrategy]();
  }
  throw new Error("Strategy not found");
})();