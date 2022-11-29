import { RiListCheck } from "react-icons/ri";
import { SimpleEditor } from "../editor/simple-editor";
import { Checkbox } from "@writeme/lego";
import { useMemo } from "react";
import { Strings } from "@writeme/core";

export const ItemEditor = (props: any) => {
  const text = props.children[2];
  const name = useMemo(() => Strings.uuid(), []);
  const className = props.className;
  if (className === "task-list-item" && typeof text === "string") {
    const checked = props.children[0].props.checked;
    return (
      <li className="flex items-center gap-4 my-2" style={{ margin: "1.25rem 0" }}>
        <Checkbox defaultChecked={checked} id={name} />
        <SimpleEditor className="w-full inline-block text-6xl" text={props.children[2]} />
      </li>
    );
  }
  if (typeof text === "string")
    return (
      <li className="flex items-center gap-4 my-2" style={{ margin: "1.25rem 0" }}>
        <RiListCheck />
        <SimpleEditor className="w-full inline-block text-6xl" text={props.children[2]} />
      </li>
    );
  return <li>{text}</li>;
};
