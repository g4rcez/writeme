import Link from "next/link";
import { Card, Heading } from "@writeme/lego";
import { Dates, Links } from "@writeme/core";
import { writeme } from "../../../src/writeme";
import { InferGetServerSidePropsType } from "next";

export const getStaticProps = writeme.indexDashboardPagesGetStaticProps();

type Props = InferGetServerSidePropsType<typeof getStaticProps>;

export default function DashboardIndexPage({ documents }: Props) {
  return (
    <div className="container mx-auto mt-8 w-full">
      <Heading tag="h1" className="mb-4 text-3xl">
        Documents
      </Heading>
      <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {documents.map((x) => {
          const date = Dates.localeDate(x.createdAt);
          const link = Links.dashboard.document(x.id);
          return (
            <Card as="li" key={x.id} className="block">
              <time className="text-xs opacity-80" datatype={date}>
                {date}
              </time>
              <Heading tag="h2" className="text-3xl">
                <Link className="link:text-main-500 transition-colors duration-300" href={link} passHref>
                  {x.title}
                </Link>
              </Heading>
              <p className={x.description ? "my-4 opacity-80" : "my-4 opacity-40"}>
                {x.description || "- No description -"}
              </p>
            </Card>
          );
        })}
      </ul>
    </div>
  );
}
