type Rec = { name: string; value: string };

export const remarkVariables = (record: any) => () => {
  return (tree: any) => {
    const { children } = tree;
    let index = -1;
    const values = Object.keys(record).reduce<Rec[]>((acc, el) => [...acc, { name: el, value: record[el] }], []);
    while (++index < children.length) {
      const child = children[index];
      if (child.meta === "type=request" && child.lang === "bash" && child.type === "code") {
        values.forEach((variable) => {
          const regex = new RegExp(`{{${variable.name.trim()}}}`, "g");
          child.value = child.value.replace(regex, variable.value);
          child.replaced = child.value;
        });
      }
    }
  };
};
