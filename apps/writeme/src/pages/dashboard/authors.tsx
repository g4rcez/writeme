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
    <div className="container mx-auto w-full">
      <header>
        <Heading className="text-4xl" tag="h2">
          Authors
        </Heading>
        <p className="mb-4 mt-1">Create and list your authors</p>
      </header>
      <form onSubmit={onUpsert} className="my-8 grid grid-cols-1 items-end gap-8 sm:grid-cols-4">
        <Input<Domain.Author> placeholder="Name" name="name" defaultValue={author?.name} />
        <Input<Domain.Author> placeholder="Nickname" name="nickname" defaultValue={author?.nickname} />
        <Input<Domain.Author> placeholder="Email" name="email" defaultValue={author?.email} />
        <span className="flex gap-8">
          <Button type="submit">{Is.Null(author) ? "New" : "Update"}</Button>
          <Button type="reset" theme="secondary">
            Reset
          </Button>
        </span>
      </form>
      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {props.authors.map((x) => (
          <li key={`authors-${x.id}`} className="w-full">
            <button
              onClick={() => setAuthor(x)}
              className="link:border-main-300 group w-full rounded-lg border border-slate-400 p-4 text-left transition-colors duration-300"
            >
              <header className="inline-flex w-full justify-between">
                <Heading tag="h3" className="group-hover:text-main-300 mb-2 text-2xl transition-colors duration-300">
                  {x.name}
                </Heading>
                <button onClick={onDelete} data-id={x.id} className="link:text-red-600 link:underline text-red-400">
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
