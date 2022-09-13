import { Input, InputProps } from "src/components/index";
import React, { useState } from "react";

export type FrontMatter = { name: string; value: string };

type FrontMatterHeaders = FrontMatter & {
  readonlyTitle?: boolean;
};

const Field: React.FC<Omit<InputProps, "ref">> = (props) => (
  <label className="flex-col w-full gap-y-1 flex" htmlFor={props.id}>
    <span className="text-sm tracking-wider font-semibold">{props.title}:</span>
    <Input {...props} className="w-full text-normal" id={props.id} />
  </label>
);

const FrontMatterForm: React.FC<{
  showAdd: boolean;
  id: number;
  matter: FrontMatterHeaders;
}> = (props) => {
  const [matter, setMatter] = useState(props.matter);

  const onChange: InputProps["onChange"] = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setMatter((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section data-form="front-matter" className="flex w-full gap-x-4 mb-4 items-end">
      <Field
        id={`title-${props.id}`}
        name="name"
        onChange={onChange}
        readOnly={props.matter.readonlyTitle}
        required
        title="Field"
        value={matter.name}
      />
      <Field onChange={onChange} value={matter.value} name="value" id={`value-${props.id}`} title="Value" />
    </section>
  );
};

export const FrontMatter: React.FC<{ headers: FrontMatterHeaders[] }> = (props) => (
  <section className="flex flex-col w-full gap-x-4">
    {props.headers.map((header, id) => (
      <FrontMatterForm
        showAdd={id === props.headers.length - 1}
        key={`front-matter-id-${id}`}
        id={id}
        matter={header}
      />
    ))}
  </section>
);
