export type WritemeRcConfig = {
  title: string;
  baseUrl?: string;
  strategy?: string;
  defaultRepository?: string;
  requestVariables?: Partial<Record<string, ConfigValues>>;
};

type ConfigValues = string | number | null | ConfigValues[];

export const config = <Input extends WritemeRcConfig>(c: Input) => c;
