import { Strings } from "./strings";

export namespace Dates {
  export const localeDate = (iso: string) => {
    const date = new Date(iso);
    const month = date.getMonth() + 1;
    const hours = Strings.pad(date.getHours().toString());
    const minutes = Strings.pad(date.getMinutes().toString());
    return `${date.getFullYear()}-${Strings.pad(month.toString())}-${date.getDate()} ${hours}:${minutes}`;
  };
}
