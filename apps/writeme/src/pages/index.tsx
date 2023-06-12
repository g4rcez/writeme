import React from "react";
import { InferGetStaticPropsType } from "next";
import Link from "next/link";
import { Links } from "@writeme/core";
import { Img } from "@writeme/lego";
import { writeme } from "../writeme";

export const getStaticProps = writeme.getAllCategoriesStaticProps();

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function Home({ categories }: Props) {
  return (
    <main className="container mx-auto flex w-full flex-col justify-between px-6">
      <header className="mb-6 mt-8 py-20">
        <h1 className="leading-1 from-primary to-primary-subtle mx-auto mb-6 max-w-4xl bg-gradient-to-r bg-clip-text py-4 text-center text-6xl font-extrabold tracking-tight text-transparent">
          Write docs and transform in an amazing interactive website
        </h1>
        <p className="text-md mx-auto max-w-2xl text-center font-medium">
          Write it's a document engine for developers and engineers. Now you can create amazing document pages for your
          products and API's
        </p>
      </header>
      <section className="my-4 grid w-full grid-cols-1 gap-12 md:grid-cols-2">
        {categories.map((category) => (
          <Link
            className="link:border-slate-300 dark:link:border-zinc-500 block max-w-5xl rounded-lg border border-slate-200 bg-white p-8 shadow-sm backdrop-blur-md transition-colors duration-300 dark:border-zinc-700 dark:bg-transparent"
            key={category.id}
            passHref
            href={Links.toDoc(category.url)}
          >
            {category.icon && (
              <Img
                src={category.icon}
                alt={`Image for ${category.title}`}
                className="float-left mr-8 block aspect-square w-32 rounded"
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
