import { FormEvent } from "react";
import { useRouter } from "next/dist/client/router";
import { GetStaticPaths, GetStaticProps } from "next";
import { httpClient, Links } from "@writeme/core";
import { Button, Input } from "@writeme/lego";
import { MarkdownEditor } from "@writeme/admin";
import { writeme } from "../../../src/writeme";
import { Domain } from "@writeme/api";

const FORM_NAME = "edit-form";

export const getStaticPaths = writeme.documentsPageGetStaticPaths("id");

export const getStaticProps = writeme.documentsByIdPageGetStaticProps("id");

type Props = {
  document: Domain.Document;
};

export default function DashboardEditDocumentPage(props: Props) {
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const inputs = Array.from(form.querySelectorAll(`input[form=${FORM_NAME}],textarea[form=${FORM_NAME}]`)) as Array<
      HTMLInputElement | HTMLTextAreaElement
    >;
    const state = inputs.reduce(
      (acc, el) => ({
        ...acc,
        [el.name]: (el as HTMLInputElement).valueAsNumber || el.value,
      }),
      { category: "roadmap" } as Record<string, unknown>
    );
    try {
      const newState = { ...state, id: doc.id ?? doc.url };
      await httpClient.put(`/documents/${newState.id}`, newState);
      await router.push(Links.dashboard.documentRoot);
    } catch (e) {
      console.error(state, e);
    }
  };

  const doc = props.document;
  return (
    <div className="container mx-auto w-full">
      <form onSubmit={onSubmit}>
        <input type="hidden" name="id" defaultValue={doc.id} />
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          <Input defaultValue={doc.title} form={FORM_NAME} name="title" placeholder="Title" />
          <Input defaultValue={doc.url} form={FORM_NAME} name="url" placeholder="Url" />
          <Input defaultValue={doc.index} type="number" form={FORM_NAME} name="index" placeholder="Order" />
          <Input defaultValue={doc.description} form={FORM_NAME} name="description" placeholder="Description" />
        </div>
        <div className="relative">
          <Button type="submit" className="absolute -top-4 right-0">
            Update
          </Button>
          <MarkdownEditor name="content" text={doc.content} viewHeader form={FORM_NAME} />
        </div>
      </form>
    </div>
  );
}
