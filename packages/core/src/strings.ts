export namespace Strings {
  export const pad = (str: string) => str.padStart(2, "0");

  export const uuid = (): string =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      let r = (Math.random() * 16) | 0;
      let v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

  export const slug = (str: string = "") => {
    str = str.replace(/^\s+|\s+$/g, "");
    str = str.toLowerCase();

    let from = "ãàáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    let to = "aaaaaeeeeiiiioooouuuunc------";
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    return str
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  export const normalizePath = (str: string) => str.replace(/\/\//g, "/");

  export const concatUrl = (baseURL: string, ...urls: string[]) =>
    normalizePath(urls.reduce((acc, el) => acc.replace(/\/+$/, "") + "/" + el.replace(/^\/+/, ""), baseURL));

  export const capitalize = (str = "") =>
    str
      .match(/[A-Z]{2,}(?=[A-Z][a-záéíóúõôê]+[0-9]*|\b)|[A-Z]?[a-záéíóúõôê]+[0-9]*|[A-Z]|[0-9]+/g)
      ?.map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
      .join(" ")
      .replace(/(\d+)/g, " $1")
      .replace(/\s+/g, " ") ?? "";
}
