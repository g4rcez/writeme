export type ColorDict = Record<string, string | Record<string, string>>;

export function setCssVars(element: HTMLElement, colors: ColorDict, prefix?: string): ColorDict {
  const newColors: ColorDict = {};
  for (const key in colors) {
    const prefixColor = prefix !== undefined ? `${prefix}-` : "";
    const colorKey = `--${prefixColor}${key}`;
    const value = colors[key];
    if (typeof value === "string") {
      element.style.setProperty(colorKey, colors[key] as string);
    }
    if (typeof value === "object") {
      const objectPrefix = prefix === undefined ? `${key}` : prefixColor;
      setCssVars(element, value, objectPrefix) as never;
    }
  }
  return newColors;
}
