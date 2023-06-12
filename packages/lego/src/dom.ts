import { Types } from "@writeme/core";

export const imperativeChange = (input: Types.Nullable<HTMLInputElement>, value: string) => {
  const nativeInput = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
  nativeInput?.call(input, value);
  const onChangeEventMock = new Event("change", { bubbles: true });
  input?.dispatchEvent(onChangeEventMock);
};
