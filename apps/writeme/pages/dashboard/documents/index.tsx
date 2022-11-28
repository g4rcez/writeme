import Link from "next/link";
import { Card, Heading } from "@writeme/lego";
import { Dates, Links } from "@writeme/core";
import { Domain } from "@writeme/api";
import { writeme } from "../../../src/writeme";

type Props = {
  documents: Domain.DocumentDesc[];
};

export const getStaticProps = writeme.indexDashboardPagesGetStaticProps();

export default function DashboardIndexPage({ documents }: Props) {
  return (
    <div className="container w-full mx-auto mt-8">
      <Heading tag="h1" className="text-3xl mb-4">
        Documents
      </Heading>
      <ul className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {documents.map((x) => {
          const date = Dates.localeDate(x.createdAt);
          const link = Links.dashboard.document(x.id);
          return (
            <Card as="li" key={x.id} className="block">
              <Heading tag="h2" className="text-3xl">
                <Link className="link:text-main-500 transition-colors duration-300" href={link} passHref>
                  {x.title}
                </Link>
              </Heading>
              <p className={x.description ? "opacity-70 my-4" : "opacity-40 my-4"}>
                {x.description || "- No description -"}
              </p>
              <time datatype={date}>{date}</time>
            </Card>
          );
        })}
      </ul>
    </div>
  );
}
