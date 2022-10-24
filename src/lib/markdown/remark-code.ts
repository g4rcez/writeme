export const remarkCode = () => (tree: any) => {
  const { children } = tree;
  let index = -1;
  while (++index < children.length) {
    const child = children[index];
    const isCode = child.type === "code";
    if (isCode) {

    }
  }
};
