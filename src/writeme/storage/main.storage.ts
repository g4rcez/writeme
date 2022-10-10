import { FsStorage } from "./fs.storage";
import { Writeme } from "../../lib/writeme";
import { Helpers } from "../../lib/helpers";
import { Storage } from "./storage";

const Strategies = {
  fs: FsStorage,
};

export const storage = ((): Storage => {
  const providedStrategy = Writeme.config?.strategy ?? "fs";
  if (Helpers.has(Strategies, providedStrategy)) {
    return new Strategies[providedStrategy]();
  }
  throw new Error("Strategy not found")
})();
