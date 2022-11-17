import { FormEvent } from "react";
import { useRouter } from "next/router";
import { httpClient } from "@writeme/core";
import { Input, Button } from "@writeme/lego";
import { MarkdownEditor } from "@writeme/admin";

const FORM_NAME = "form";

export default function DashboardDocumentsPage() {
  const nullDocument = true;
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const inputs = Array.from(form.querySelectorAll(`input[form=${FORM_NAME}],textarea[${FORM_NAME}]`)) as Array<
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
      const fn = nullDocument ? httpClient.post : httpClient.patch;
      const url = nullDocument ? "/documents" : `/documents/${state.id}`;
      await fn(url, state);
      router.reload();
    } catch (e) {
      console.log(state);
    }
  };

  return (
    <div className="container w-full mx-auto">
      <form onSubmit={onSubmit}>
        <div className="grid md:grid-cols-4 grid-cols-1 gap-8 mb-8">
          <Input form={FORM_NAME} name="title" placeholder="Title" />
          <Input form={FORM_NAME} name="url" placeholder="Url" />
          <Input type="number" form={FORM_NAME} name="index" placeholder="Order" />
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
