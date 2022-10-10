export namespace Dates {
  export const localeDate = (iso: string, locale: string | undefined = undefined) =>
    new Date(iso).toLocaleDateString(locale, { day: "2-digit", month: "2-digit", year: "numeric" });
}
