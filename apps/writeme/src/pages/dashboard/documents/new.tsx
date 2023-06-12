import { FormEvent } from "react";
import { useRouter } from "next/router";
import { httpClient } from "@writeme/core";
import { Input, Button } from "@writeme/lego";
import { MarkdownEditor } from "@writeme/admin";
import { writeme } from "../../../writeme";
import { InferGetStaticPropsType } from "next";

const FORM_NAME = "form";

export const getStaticProps = writeme.getAllCategoriesStaticProps();

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function DashboardDocumentsPage(props: Props) {
  const nullDocument = true;
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const inputs = Array.from(form.querySelectorAll(`input[form=${FORM_NAME}],textarea[${FORM_NAME}]`)) as Array<
      HTMLInputElement | HTMLTextAreaElement
    >;
    const state = inputs.reduce(
      (acc, el) => ({ ...acc, [el.name]: (el as HTMLInputElement).valueAsNumber || el.value }),
      { category: "roadmap" } as Record<string, unknown>
    );
    try {
      const fn = nullDocument ? httpClient.post : httpClient.patch;
      const url = nullDocument ? "/documents" : `/documents/${state.id}`;
      await fn(url, state);
      router.reload();
    } catch (e) {
      console.error(state);
    }
  };

  return (
    <div className="container mx-auto w-full">
      <form onSubmit={onSubmit}>
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          <Input form={FORM_NAME} name="title" placeholder="Title" />
          <Input form={FORM_NAME} name="url" placeholder="Url" />
          <Input form={FORM_NAME} type="number" name="index" placeholder="Order" />
          <Input form={FORM_NAME} name="description" placeholder="Description" />
        </div>
        <div className="relative">
          <Button type="submit" className="absolute -top-4 right-0">
            Create Document
          </Button>
          <MarkdownEditor name="content" viewHeader form={FORM_NAME} />
        </div>
      </form>
    </div>
  );
}
