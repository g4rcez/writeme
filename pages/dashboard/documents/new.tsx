import { Heading, Select, SiteContainer } from "components";
import { FrontMatter } from "components/document/front-matter";
import { Writer } from "components/writer/writer";
import { Database } from "db/database";
import { httpClient } from "lib/http-client";
import { Links } from "lib/links";
import { GetStaticProps } from "next";
import Router from "next/router";
import { DocumentPutRequest } from "pages/api/document";
import React, { FormEventHandler, useState } from "react";

type Props = {
  groups: Database.Group[];
};

export const getStaticProps: GetStaticProps = async () => {
  const groups = await Database.allGroups();
  return {
    props: { groups },
    revalidate: 10,
  };
};

const frontMatterHeaders = [
  { name: "title", value: "Title", readonlyTitle: true },
  { name: "slug", value: "slug", readonlyTitle: true },
  { name: "description", value: "Description", readonlyTitle: true },
  { name: "repository", value: "", readonlyTitle: true },
  { name: "position", value: "", readonlyTitle: true },
  { name: "sidebar", value: "", readonlyTitle: true },
];

export default function DashboardNewDocument(props: Props) {
  const [groupId, setGroupId] = useState("");

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
        markdown: "",
        documentId: "",
        frontMatter: withoutPosition,
        position: Number.parseInt(position.value),
      };
      const response = await httpClient.put<DocumentPutRequest>("/document", body);
      const id = response.data.data.document?.id ?? "";
      Router.push(Links.adminUpdateDocuments(id));
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
        <div className="mb-8">
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
        <div className="my-4">
          <Heading tag="h3" className="text-2xl mb-4">
            Headers
          </Heading>
          <FrontMatter headers={frontMatterHeaders} />
        </div>
        <button className="button mt-4" type="submit">
          Save document
        </button>
      </form>
    </SiteContainer>
  );
}
