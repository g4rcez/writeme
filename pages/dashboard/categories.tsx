import { Heading, Input } from "../../src/components";
import { FormEvent } from "react";
import { httpClient } from "../../src/lib/http-client";
import type { Categories } from "../../src/writeme/storage/storage";
import { categoriesService } from "../../src/writeme/service/categories";
import { InferGetStaticPropsType } from "next";

const CreateCategory = (props: { category?: Categories }) => {
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const inputs = [...form.elements].filter((x) => x.tagName.toLowerCase() === "input") as HTMLInputElement[];
    const state = inputs.reduce((acc, el) => ({ ...acc, [el.name]: el.value ?? "" }), {} as Categories);
    try {
      const response = await httpClient.post("/categories", { ...state, index: Number(state.index) });
      console.log(response);
    } catch (e: any) {
      console.log(e.response.data);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-4 gap-8">
      <Input required placeholder="Title" name="title" />
      <Input required placeholder="Url" name="url" />
      <Input required placeholder="Index" name="index" type="number" />
      <Input required placeholder="Description" name="description" />
      <Input placeholder="Icon" name="icon" type="url" />
      <Input placeholder="Banner" name="banner" />
      <button className="button w-fit min-w-[110px]">{!props.category ? "New" : "Update"}</button>
    </form>
  );
};

export const getStaticProps = async () => {
  const categories = await categoriesService.getCategories();
  return { props: { categories } };
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function DashboardCategoriesPage(props: Props) {
  return (
    <div className="mx-auto container w-full">
      <CreateCategory />
      <section className="mt-8">
        <Heading className="text-4xl mb-4" tag="h2">
          Categories
        </Heading>
        <ul>
          {props.categories.map((x) => (
            <li key={x.id} className="my-2">{x.title}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
