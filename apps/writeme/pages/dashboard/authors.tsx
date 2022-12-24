import { writeme } from "../../src/writeme";
import { InferGetStaticPropsType } from "next";
import React, { useState } from "react";
import { Button, Heading, Input } from "@writeme/lego";
import { httpClient, Is, Types } from "@writeme/core";
import { Domain } from "@writeme/api";

export const getStaticProps = writeme.getAllAuthorsProps();

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function AuthorsDashboardPage(props: Props) {
  const [author, setAuthor] = useState<Types.Nullable<Domain.Author>>(null);
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (author === null) return;
    const state = { ...author, ...Object.fromEntries(new FormData(form).entries()), id: author.id } as Domain.Author;
    await httpClient.post("/authors", state);
  };

  return (
    <div className="mx-auto container w-full">
      <header>
        <Heading className="text-4xl" tag="h2">
          Authors
        </Heading>
        <p className="mt-1 mb-4">Create and list your authors</p>
      </header>
      {!Is.Null(author) && (
        <section className="my-8">
          <form onSubmit={onSubmit} className="grid items-center grid-cols-1 sm:grid-cols-4 gap-8">
            <Input<Domain.Author> name="name" defaultValue={author.name} />
            <Input<Domain.Author> name="nickname" defaultValue={author.nickname} />
            <Input<Domain.Author> name="email" defaultValue={author.email} />
            <Button type="submit" className="w-fit">
              Submit
            </Button>
          </form>
        </section>
      )}
      <ul className="gap-8 grid grid-cols-1 sm:grid-cols-3">
        {props.authors.map((x) => (
          <li key={`authors-${x.id}`} className="w-full">
            <button
              onClick={() => setAuthor(x)}
              className="p-4 border rounded-lg border-slate-400 text-left w-full duration-300 transition-colors link:border-main-300 group"
            >
              <Heading tag="h3" className="text-2xl mb-2 group-hover:text-main-300 transition-colors duration-300">
                {x.name}
              </Heading>
              <p className="mb-4">@{x.nickname}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
