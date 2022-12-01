import { TextResolver } from "../editor/resolver";

export const ItemEditor = (props: any) => {
  return (
    <li className="flex items-center gap-4 my-2" style={{ margin: "1.25rem 0" }}>
      <TextResolver children={props.children} />
    </li>
  );
};
