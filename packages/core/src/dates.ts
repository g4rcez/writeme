export namespace Dates {
  const pad = (str: string) => str.padStart(2, "0");

  export const localeDate = (iso: string) => {
    const date = new Date(iso);
    const month = date.getMonth() + 1;
    const hours = pad(date.getHours().toString());
    const minutes = pad(date.getMinutes().toString());
    return `${date.getFullYear()}-${pad(month.toString())}-${date.getDate()} ${hours}:${minutes}`;
  };
}
