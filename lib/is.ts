export namespace Is {
  export const Json = (json: string) => {
    try {
      JSON.parse(json);
      return true;
    } catch (error) {
      return false;
    }
  };

  export const Prototype = (a: any) =>
    Object.getPrototypeOf(a).constructor.name;

  export const NilOrEmpty = (a: any): a is undefined | null =>
    a === null || a === undefined;
}
