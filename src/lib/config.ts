import FsSync from "fs";
import Path from "path";

export namespace Config {
  type RecursiveDict = {
    [k: string]: string | RecursiveDict;
  };

  type ConfigValues = string | number | null | ConfigValues[];

  export type Type = {
    title: string;
    baseUrl?: string;
    strategy?: string;
    defaultRepository?: string;
    requestVariables?: Partial<Record<string, ConfigValues>>;
  };

  export const get = (): Type => {
    const path = Path.join(process.cwd(), "writeme.ts");
    const exists = FsSync.existsSync(path);
    if (!exists) return require(path);
    return { title: "Writeme" };
  };

  export const properties = get();

  export const define = (newConfig: Type) => newConfig;
}
