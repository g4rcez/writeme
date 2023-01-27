import { writeme } from "../../src/writeme";
import { InferGetStaticPropsType } from "next";
import React, { useState } from "react";
import { Button, Heading, Input } from "@writeme/lego";
import { httpClient, Is, Types } from "@writeme/core";
import { Domain } from "@writeme/api";
import { FaTrashAlt } from "react-icons/fa";
import { useRouter } from "next/router";

export const getStaticProps = writeme.getAllAuthorsProps();

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function AuthorsDashboardPage(props: Props) {
  const [author, setAuthor] = useState<Types.Nullable<Domain.Author>>(null);
  const router = useRouter();

  const onUpsert = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (author === null) {
      const elements = form.elements;

      const name = (elements.namedItem("name") as HTMLInputElement).value;
      const nickname = (elements.namedItem("nickname") as HTMLInputElement).value;
      const email = (elements.namedItem("email") as HTMLInputElement).value;
      await httpClient.post("/authors", { name, nickname, email, links: [] });
      return router.reload();
    }
    const state = { ...author, ...Object.fromEntries(new FormData(form).entries()), id: author.id } as Domain.Author;
    await httpClient.put(`/authors/${author.id}`, state);
    await router.reload();
  };

  const onDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const id = e.currentTarget.dataset.id ?? "";
    await httpClient.delete(`/authors/${id}`);
    await router.reload();
  };

  return (
    <div className="mx-auto container w-full">
      <header>
        <Heading className="text-4xl" tag="h2">
          Authors
        </Heading>
        <p className="mt-1 mb-4">Create and list your authors</p>
      </header>
      <form onSubmit={onUpsert} className="my-8 grid items-end grid-cols-1 sm:grid-cols-4 gap-8">
        <Input<Domain.Author> placeholder="Name" name="name" defaultValue={author?.name} />
        <Input<Domain.Author> placeholder="Nickname" name="nickname" defaultValue={author?.nickname} />
        <Input<Domain.Author> placeholder="Email" name="email" defaultValue={author?.email} />
        <span className="gap-8 flex">
          <Button type="submit">{Is.Null(author) ? "New" : "Update"}</Button>
          <Button type="reset" theme="secondary">
            Reset
          </Button>
        </span>
      </form>
      <ul className="gap-8 grid grid-cols-1 sm:grid-cols-3">
        {props.authors.map((x) => (
          <li key={`authors-${x.id}`} className="w-full">
            <button
              onClick={() => setAuthor(x)}
              className="p-4 border rounded-lg border-slate-400 text-left w-full duration-300 transition-colors link:border-main-300 group"
            >
              <header className="inline-flex justify-between w-full">
                <Heading tag="h3" className="text-2xl mb-2 group-hover:text-main-300 transition-colors duration-300">
                  {x.name}
                </Heading>
                <button onClick={onDelete} data-id={x.id} className="text-red-400 link:text-red-600 link:underline">
                  <FaTrashAlt aria-hidden={true} />
                </button>
              </header>
              <p className="mb-4">@{x.nickname}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
