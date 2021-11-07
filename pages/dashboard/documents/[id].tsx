import Link from "next/link";
import { Heading, Select, SiteContainer } from "components";
import { FrontMatter } from "components/document/front-matter";
import { Writer } from "components/writer/writer";
import { Database } from "db/database";
import matter from "gray-matter";
import { httpClient } from "lib/http-client";
import { Strings } from "lib/strings";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { DocumentPutRequest } from "pages/api/document";
import React, { FormEventHandler, useState } from "react";
import { BsEye, BsEyeSlash, BsTrash } from "react-icons/bs";
import Router from "next/router";
import { Links } from "lib/links";
import { Is } from "lib/is";

type Props = {
  groups: Database.Group[];
  document: Database.DocumentWithGroup & { frontMatter: FrontMatter[] };
};

export const getServerSideProps: GetServerSideProps = async (props) => {
  const id = (props.params?.id as string) ?? "";
  const document = await Database.documentById(id);
  if (Is.NilOrEmpty(document)) {
    return { notFound: true };
  }
  const { content, data } = matter(document.content);
  const groups = await Database.allGroups();
  const frontMatter = Object.keys(data)
    .reduce<FrontMatter[]>(
      (acc, el) => [...acc, { name: el, value: data[el] }],
      [
        {
          name: "position",
          value: document.position.toString(),
        },
      ]
    )
    .sort((a, b) => a.name.localeCompare(b.name));
  return {
    revalidate: 10,
    props: {
      groups,
      document: {
        ...document,
        content: content.trim(),
        createdAt: document.createdAt.toISOString(),
        updatedAt: document.updatedAt.toISOString(),
        frontMatter,
      },
    },
  };
};

// export const getStaticPaths: GetStaticPaths = async () => {
//   const documents = await Database.allDocuments();
//   return { paths: documents.map((x) => ({ params: { id: x.id } })), fallback: true };
// };

export default function WriterPage(props: Props) {
  const [markdown, setMarkdown] = useState(props.document.content);
  const [groupId, setGroupId] = useState(props.document.groupId);
  const [hideHeaders, setHideHeaders] = useState(true);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const submitterElement: HTMLElement = (event.nativeEvent as any).submitter;
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
      console.log({ position });
      const body = {
        groupId,
        markdown,
        documentId: props.document.id,
        frontMatter: withoutPosition,
        position: Number.parseInt(position.value),
      };
      await httpClient.put<DocumentPutRequest>("/document", body);
      if (submitterElement.dataset.preview === "preview") {
        Router.push(Strings.concatUrl("/docs", props.document.group.slug, props.document.slug));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSelect: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const value = event.target.value;
    setGroupId(value);
  };

  const onDelete = async () => {
    await httpClient.delete(`/document?id=${props.document.id}`);
    Router.push(Links.adminDocuments);
  };

  const toggleHeaders = () => setHideHeaders((prev) => !prev);

  return (
    <SiteContainer tag="section">
      <form onSubmit={onSubmit} className="w-full my-8 px-4">
        <div className="mb-8 flex justify-between">
          <div className="w-full">
            <Heading tag="h3" className="text-2xl">
              Group
            </Heading>
            <Select required value={groupId} onChange={onSelect} placeholder="Select a Group">
              <option value="">Select a Group</option>
              {props.groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.title}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex gap-x-4 h-fit items-baseline">
            <button data-preview="preview" type="submit" className="button flex items-center gap-x-2 text-normal">
              <BsEye />
              Preview
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="button bg-fail-normal hover:bg-fail-hover active:bg-fail-hover flex items-center gap-x-2 text-normal"
            >
              <BsTrash />
              Delete
            </button>
          </div>
        </div>
        <Heading tag="h3" className="mb-4 text-2xl flex items-center gap-x-2">
          <button
            type="button"
            className="flex items-center text-base opacity-30 hover:opacity-100 transition-opacity duration-300"
            onClick={toggleHeaders}
          >
            {(hideHeaders && <BsEyeSlash />) || <BsEye />}
          </button>
          File Metadata
        </Heading>
        <div className="my-4" hidden={hideHeaders}>
          <FrontMatter headers={props.document.frontMatter} />
        </div>
        <Writer databaseMode markdown={markdown} onChange={setMarkdown} />
        <button className="button mt-4" type="submit">
          Save document
        </button>
      </form>
    </SiteContainer>
  );
}
