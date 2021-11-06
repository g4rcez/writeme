import { Heading, SiteContainer, Text } from "components";
import { Divider } from "components/divider";
import { Database } from "db/database";
import { GetStaticProps } from "next";
import Link from "next/link";

export const getStaticProps: GetStaticProps = async () => {
  const documents = await Database.allDocuments();
  return { props: { documents: documents.sort((a, b) => a.group.position - b.group.position) }, revalidate: 10 };
};

type Props = {
  documents: Database.AllDocuments[];
};

export default function DashboardDocumentIndex(props: Props) {
  return (
    <SiteContainer>
      <header>
        <Heading tag="h1" className="text-5xl">
          Documents
        </Heading>
      </header>
      <section className="w-full flex my-2 flex-wrap gap-4">
        {props.documents.map((document) => {
          const href = `/dashboard/document/${document.id}`;
          return (
            <Link href={href} key={document.id}>
              <a
                href={href}
                className="group border transition-all duration-300 p-4 border-border-slight rounded max-w-sm w-full hover:border-main-normal group-hover:border-border-neutral"
              >
                <Heading tag="h3" className="text-3xl group-hover:text-main-normal">
                  {document.title}
                </Heading>
                <Divider />
                <Text>
                  <b>Group:</b> {document.group.title}
                </Text>
                <Text>
                  <b>Description: </b>
                  {document.description}
                </Text>
              </a>
            </Link>
          );
        })}
      </section>
    </SiteContainer>
  );
}
