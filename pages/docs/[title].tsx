import { SiteContainer } from "src/components/";
import { GetStaticPaths, InferGetStaticPropsType } from "next";
import { strategy } from "../../src/strategies/main.strategy";


export const getStaticPaths: GetStaticPaths = async () => {
  const docs = await strategy.getAllDocumentPaths();
  return {
    fallback: false,
    paths: docs.map((title) => ({ params: { title } }))
  };
};

export const getStaticProps = async (props: any) => {
  const title = props.params?.title;
  try {
    const post = await strategy.getDocument(title);
    if (post === null) {
      return { notFound: true };
    }
    return { props: { title, post }, revalidate: false };
  } catch (error) {
    console.log(error);
    if (process.env.NODE_ENV === "development") throw error;
    return { notFound: true };
  }
};


const providerValue = { theme: "light", titlePrefix: "WriteMe" };

export default function Component(props: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <SiteContainer tag="section">
      <pre>
        <code>
          {JSON.stringify(props, null, 4)}
        </code>
      </pre>
    </SiteContainer>
  );
}
