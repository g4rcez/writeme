import { Input, InputProps, Select, SiteContainer } from "components";
import { Writer } from "components/writer/writer";
import { Database } from "db/database";
import matter from "gray-matter";
import { httpClient } from "lib/http-client";
import { GetStaticPaths, GetStaticProps } from "next";
import { DocumentPutRequest } from "pages/api/document";
import React, { FormEventHandler, useCallback, useState } from "react";
import { BsPlusCircle, BsTrash } from "react-icons/bs";

type FrontMatter = { name: string; value: string };

type Props = {
  groups: Database.Group[];
  document: Database.Document & { frontMatter: FrontMatter[] };
};

export const getStaticProps: GetStaticProps = async (props) => {
  const id = (props.params?.id as string) ?? "";
  const document = (await Database.documentById(id))!;
  const { content, data } = matter(document.content);
  const groups = await Database.allGroups();
  return {
    props: {
      groups,
      document: {
        ...document,
        content: content.trim(),
        frontMatter: Object.keys(data).reduce<FrontMatter[]>((acc, el) => [...acc, { name: el, value: data[el] }], []),
        createdAt: document.createdAt.toISOString(),
        updatedAt: document.updatedAt.toISOString(),
      },
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const documents = await Database.allDocuments();
  return { paths: documents.map((x) => ({ params: { id: x.id } })), fallback: true };
};

const Field: React.FC<Omit<InputProps, "ref">> = (props) => (
  <label className="flex-col w-full gap-y-1 flex" htmlFor={props.id}>
    <span className="text-lg">{props.title}:</span>
    <Input {...props} className="w-full" id={props.id} />
  </label>
);

type FrontMatterHeaders = FrontMatter & {
  readonlyTitle?: boolean;
};

const FrontMatterForm: React.FC<{
  showAdd: boolean;
  id: number;
  matter: FrontMatterHeaders;
  onAddItem: (index: number) => void;
}> = ({ onAddItem, ...props }) => {
  const [matter, setMatter] = useState(props.matter);

  const onChange: InputProps["onChange"] = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setMatter((prev) => ({ ...prev, [name]: value }));
  };

  const onAdd = useCallback(() => onAddItem(props.id + 1), [onAddItem, props.id]);

  return (
    <section data-form="front-matter" className="flex w-full gap-x-4 mb-4 items-end">
      <Field
        readOnly={props.matter.readonlyTitle}
        value={matter.name}
        onChange={onChange}
        name="name"
        required
        id={`title-${props.id}`}
        title="Field"
      />
      <Field onChange={onChange} value={matter.value} name="value" id={`value-${props.id}`} title="Value" />
      <span className="flex flex-nowrap">
        <button type="button" onClick={onAdd} className="p-2 h-fit text-fail-normal text-xl rounded">
          <BsTrash />
        </button>
      </span>
    </section>
  );
};

const FrontMatter: React.VFC<{ frontMatter: FrontMatterHeaders[] }> = (props) => {
  const [headers, setHeaders] = useState<FrontMatterHeaders[]>(
    () =>
      props.frontMatter ?? [
        { name: "title", value: "Title", readonlyTitle: true },
        { name: "slug", value: "slug", readonlyTitle: true },
        { name: "description", value: "Description", readonlyTitle: true },
        { name: "repository", value: "", readonlyTitle: true },
        { name: "position", value: "", readonlyTitle: true },
        { name: "sidebar", value: "", readonlyTitle: true },
        // { name: "tags", value: "[]", readonlyTitle: true },
      ]
  );

  const onAdd = useCallback(() => {
    setHeaders((prev) => {
      const newItem = { name: "", value: "", readonlyTitle: false };
      return [...prev, newItem];
    });
  }, []);

  return (
    <section className="flex flex-col w-full gap-x-4 mb-4 pt-8">
      {headers.map((header, id) => (
        <FrontMatterForm
          showAdd={id === headers.length - 1}
          key={`front-matter-id-${id}`}
          onAddItem={onAdd}
          id={id}
          matter={header}
        />
      ))}
      <section>
        <button
          type="button"
          onClick={onAdd}
          className="p-2 gap-x-2 items-center flex text-form-text-input text-xl rounded"
        >
          <BsPlusCircle /> Add
        </button>
      </section>
    </section>
  );
};

export default function WriterPage(props: Props) {
  const [markdown, setMarkdown] = useState(props.document.content);
  const [documentId, setDocumentId] = useState(props.document.id);
  const [groupId, setGroupId] = useState(props.document.groupId);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const frontMatterItems = Array.from(form.querySelectorAll("[data-form='front-matter']"));

    const frontMatter = frontMatterItems.reduce<FrontMatter[]>((acc, el) => {
      const inputWithName = el.querySelector("input[name=name]") as HTMLInputElement;
      const inputWithValue = el.querySelector("input[name=value]") as HTMLInputElement;
      const item = { name: inputWithName.value, value: inputWithValue.value };
      return [...acc, item];
    }, []);

    try {
      const withoutPosition = frontMatter.filter((item) => item.name !== "position");
      const position = frontMatter.find((item) => item.name === "position")!;
      const body = {
        groupId,
        markdown,
        documentId,
        frontMatter: withoutPosition,
        position: Number.parseInt(position.value),
      };
      const response = await httpClient.put<DocumentPutRequest>("/document", body);
      setDocumentId(response.data.data.document?.id ?? "");
    } catch (error) {
      console.log(error);
    }
  };

  const onSelect: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const value = event.target.value;
    setGroupId(value);
  };

  return (
    <SiteContainer tag="section">
      <form onSubmit={onSubmit} className="w-full my-8 px-4">
        <Select required value={groupId} onChange={onSelect} placeholder="Select a Group">
          <option value="">Select a Group</option>
          {props.groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.title}
            </option>
          ))}
        </Select>
        <FrontMatter frontMatter={props.document.frontMatter} />
        <Writer markdown={markdown} onChange={setMarkdown} />
        <button className="button mt-4" type="submit">
          Save document
        </button>
      </form>
    </SiteContainer>
  );
}
