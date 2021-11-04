import Path from "path";
import Fs from "fs";

type RecursiveDict = {
  [k: string]: string | RecursiveDict;
};

export type WritemeRcProps = {
  tokens: {
    colors: RecursiveDict;
  };
  defaultRepository: string;
  cssWatchDirectories: string[];
  requestVariables: Record<string, string>;
};

export const WritemeRc = (): WritemeRcProps | null => {
  const path = Path.join(process.cwd(), "writeme.json");
  if (Fs.existsSync(path)) return JSON.parse(Fs.readFileSync(path, "utf-8"));
  return null;
};
