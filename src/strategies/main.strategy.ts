import { FsStrategy } from "./fs.strategy";
import { Writeme } from "../lib/writeme";
import { Helpers } from "../lib/helpers";

const strategies = {
  fs: () => new FsStrategy(),
};

export const strategy = (() => {
  const name = Writeme.config?.strategy ?? "";
  if (Helpers.has(strategies, name)) {
    return strategies[name]();
  }
  return strategies.fs();
})();
