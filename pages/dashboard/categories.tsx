import { Heading, Input } from "../../src/components";
import { FormEvent, MouseEvent, useState } from "react";
import { httpClient } from "../../src/lib/http-client";
import type { Categories } from "../../src/writeme/storage/storage";
import { categoriesService } from "../../src/writeme/service/categories";
import { InferGetStaticPropsType } from "next";
import { useRouter } from "next/dist/client/router";
import { Button } from "../../src/components/button";
import { FaTrashAlt } from "react-icons/fa";

type CategoryProps = {
  category: Types.Nullable<Categories>;
  setCategory: (category: Types.Nullable<Categories>) => void;
};

const CreateCategory = ({ category, setCategory }: CategoryProps) => {
  const nullCategory = category === null;
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const inputs = [...form.elements].filter((x) => x.tagName.toLowerCase() === "input") as HTMLInputElement[];
    const state = inputs.reduce((acc, el) => ({ ...acc, [el.name]: el.value ?? "" }), {} as Categories);
    try {
      const fn = nullCategory ? httpClient.post : httpClient.patch;
      const url = nullCategory ? "/categories" : `/categories/${category.id}`;
      await fn(url, { ...state, index: Number(state.index), id: category?.id ?? undefined });
      setCategory(null);
      form.reset();
      router.reload();
    } catch (e: any) {
      console.log(e.response.data);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full block">
      <div className="grid md:grid-cols-4 grid-cols-1 gap-8 mb-8">
        <input type="hidden" value={category?.id} name="id" />
        <Input autoFocus={!nullCategory} defaultValue={category?.title} required placeholder="Title" name="title" />
        <Input defaultValue={category?.url} required placeholder="Url" name="url" />
        <Input defaultValue={category?.index} required placeholder="Index" name="index" type="number" />
        <Input defaultValue={category?.description} required placeholder="Description" name="description" />
        <Input defaultValue={category?.icon} placeholder="Icon" name="icon" />
        <Input defaultValue={category?.banner} placeholder="Banner" name="banner" />
      </div>
      <Button className="button w-fit">{!category ? "New" : "Update"}</Button>
    </form>
  );
};

export const getStaticProps = async () => {
  const categories = await categoriesService.getCategories();
  return { props: { categories } };
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function DashboardCategoriesPage(props: Props) {
  const [category, setCategory] = useState<Types.Nullable<Categories>>(null);
  const router = useRouter();

  const onSetCategory = (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const id = button.dataset.id ?? "";
    setCategory(props.categories.find((x) => x.id === id) ?? null);
  };

  const deleteCategory = async (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const id = button.dataset.id ?? "";
    await httpClient.delete(`/categories/${id}`);
    router.reload();
  };

  return (
    <div className="mx-auto container w-full">
      <header className="mb-4">
        <Heading className="text-4xl" tag="h2">
          Categories
        </Heading>
        <p>Create or list your categories</p>
      </header>
      <section className="my-8">
        <ul className="grid md:grid-cols-4 grid-cols-1">
          {props.categories.map((x) => (
            <li key={x.id} className="my-2 items-center gap-x-1 flex">
              <button
                onClick={onSetCategory}
                className="text-lg font-medium link:text-main-300 link:underline transition-colors duration-300"
              >
                {x.title}
              </button>
              <button className="text-red-400" onClick={deleteCategory} data-id={x.id}>
                <FaTrashAlt className="" />
              </button>
            </li>
          ))}
        </ul>
      </section>
      <hr className="dark:border-zinc-700 border-slate-300 mb-8" />
      <CreateCategory category={category} setCategory={setCategory} />
    </div>
  );
}
