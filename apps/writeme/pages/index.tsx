import React from "react";
import { InferGetStaticPropsType } from "next";
import Link from "next/link";
import { Links } from "@writeme/core";
import { Img } from "@writeme/lego";
import { writeme } from "../src/writeme";

export const getStaticProps = writeme.getAllCategoriesStaticProps();

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function Home({ categories }: Props) {
  return (
    <main className="flex w-full mx-auto container flex-col px-6 justify-between">
      <header className="mt-8 mb-6">
        <h1 className="text-5xl font-bold tracking-wide leading-1">Writeme</h1>
        <p className="my-2">A markdown engine to write pretty and interactive documentations and posts.</p>
      </header>
      <section className="my-4 w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        {categories.map((category) => (
          <Link
            className="transition-colors duration-300 block shadow-sm rounded-lg p-8 max-w-5xl bg-white dark:bg-transparent backdrop-blur-md border border-slate-200 link:border-slate-300 dark:border-zinc-700 dark:link:border-zinc-500"
            key={category.id}
            passHref
            href={Links.toDoc(category.url)}
          >
            {category.icon && (
              <Img
                src={category.icon}
                alt={`Image for ${category.title}`}
                className="block w-32 aspect-square float-left mr-8 rounded"
              />
            )}
            <h2 className="text-3xl font-bold">{category.title}</h2>
            <p className="mt-2">{category.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
