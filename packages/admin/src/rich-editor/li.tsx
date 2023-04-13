import { TextResolver } from "../editor/resolver";

export const ItemEditor = (props: any) => {
  return (
    <li className="flex items-center gap-4 mb-2">
      <TextResolver children={props.children} />
    </li>
  );
};
