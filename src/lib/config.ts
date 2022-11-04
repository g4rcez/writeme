import FsSync from "fs";
import Path from "path";
import { WritemeRcConfig } from "src/writemerc";

export namespace Config {
  export const get = (): WritemeRcConfig => {
    const path = Path.join(process.cwd(), "writeme.ts");
    const exists = FsSync.existsSync(path);
    if (!exists) return require(path);
    return { title: "Writeme" };
  };

  export const properties = get();
}
