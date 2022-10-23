import { FormEvent } from "react";
import { Input } from "../../../src/components";
import { MarkdownEditor } from "../../../src/components/editor/markdown-editor";
import { Button } from "../../../src/components/button";
import { httpClient } from "../../../src/lib/http-client";
import { useRouter } from "next/dist/client/router";
import { postsService } from "../../../src/writeme/service/documents";
import { GetStaticPaths, GetStaticProps } from "next";
import { MarkdownDocument } from "../../../src/writeme/storage/storage";
import { Links } from "../../../src/lib/links";

const FORM_NAME = "edit-form";

export const getStaticPaths: GetStaticPaths = async () => {
  const allDocuments = await postsService.getAll();
  return {
    paths: allDocuments.map((x) => ({ params: { id: x.id } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (props) => {
  const id = props.params?.id as string;
  try {
    const document = await postsService.findById(id);
    return { props: { document } };
  } catch (e) {
    console.log("ERROR", e);
    return { notFound: true };
  }
};

type Props = {
  document: MarkdownDocument;
};

export default function DashboardEditDocumentPage(props: Props) {
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const inputs = [...form.querySelectorAll(`input[form=${FORM_NAME}],textarea[form=${FORM_NAME}]`)] as Array<
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
    <div className="container w-full mx-auto">
      <form onSubmit={onSubmit}>
        <input type="hidden" name="id" defaultValue={doc.id} />
        <div className="grid md:grid-cols-4 grid-cols-1 gap-8 mb-8">
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
