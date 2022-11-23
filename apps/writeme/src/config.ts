import Path from "path";
import type { WritemeRcConfig } from "@writeme/core";

export namespace Config {
  export const get = (): WritemeRcConfig => {
    const path = Path.join(process.cwd(), "writeme.ts");
    try {
      return require(path);
    } catch (e) {
      return { title: "Writeme" };
    }
  };

  export const properties = get();
}
