import { VitrineDocument } from "../../../src/writeme/storage/storage";
import { GetStaticProps } from "next";
import { postsService } from "../../../src/writeme/service/documents";
import { Heading } from "../../../src/components";
import { Dates } from "../../../src/lib/dates";
import Link from "next/link";
import { Links } from "../../../src/lib/links";

type Props = {
  documents: VitrineDocument[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const documents = await postsService.getAll();
  return {
    revalidate: 20,
    props: { documents },
  };
};

export default function DashboardIndexPage({ documents }: Props) {
  return (
    <div className="container w-full mx-auto">
      <ul className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {documents.map((x) => {
          const date = Dates.localeDate(x.createdAt);
          return (
            <li key={x.id} className="link:border-main-300 rounded-xl border-slate-200 border p-4">
              <Link href={Links.dashboard.document(x.id)} passHref>
                <a className="link:text-main-500 transition-colors duration-300" href={Links.dashboard.document(x.id)}>
                  <Heading tag="h2" className="text-3xl">
                    {x.title}
                  </Heading>
                </a>
              </Link>
              <p>{x.description}</p>
              <time datatype={date}>{date}</time>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
