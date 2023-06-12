import { Input, InputProps } from "@writeme/lego";
import React, { useState } from "react";

export type FrontMatter = { name: string; value: string };

type FrontMatterHeaders = FrontMatter & {
  readonlyTitle?: boolean;
};

const Field: React.FC<Omit<InputProps, "ref">> = (props) => (
  <label className="flex w-full flex-col gap-y-1" htmlFor={props.id}>
    <span className="text-sm font-semibold tracking-wider">{props.title}:</span>
    <Input {...props} className="text-normal w-full" id={props.id} />
  </label>
);

const FrontMatterForm = (props: { showAdd: boolean; id: number; matter: FrontMatterHeaders }) => {
  const [matter, setMatter] = useState(props.matter);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setMatter((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section data-form="front-matter" className="mb-4 flex w-full items-end gap-x-4">
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
  <section className="flex w-full flex-col gap-x-4">
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
