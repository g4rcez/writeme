import { TextResolver } from "../editor/resolver";

export const ItemEditor = (props: any) => {
  return (
    <li className="mb-2 flex items-center gap-4">
      <TextResolver children={props.children} />
    </li>
  );
};
