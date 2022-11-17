import fs from "fs";
import Path from "path";
import type { WritemeRcConfig } from "@writeme/core";

export namespace Config {
  export const get = (): WritemeRcConfig => {
    const path = Path.join(process.cwd(), "writeme.ts");
    const exists = fs.existsSync(path);
    if (!exists) return require(path);
    return { title: "Writeme" };
  };

  export const properties = get();
}
