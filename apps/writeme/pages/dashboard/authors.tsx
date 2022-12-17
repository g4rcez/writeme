import { writeme } from "../../src/writeme";
import { InferGetStaticPropsType } from "next";
import React from "react";
import Link from "next/link";
import { Heading } from "@writeme/lego";

export const getStaticProps = writeme.getAllAuthorsProps();

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function AuthorsDashboardPage(props: Props) {
  return (
    <div className="mx-auto container w-full">
      <header>
        <Heading className="text-4xl" tag="h2">
          Authors
        </Heading>
        <p>Create and list your authors</p>
      </header>
      <ul className="flex gap-8">
        {props.authors.map((x) => (
          <li key={`authors-${x.id}`}>
            <button className="p-4 border rounded-lg border-slate-400">
              <h2>{x.name}</h2>
              <p>@{x.nickname}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
