/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { Fragment, useEffect, useMemo, useState, VFC } from "react";
import Image from "next/image";

type Props = {
  url: string;
  height?: string;
  width?: string;
  styles?: string;
};

type OpenGraphAttrs = Partial<{
  description: string;
  image: string;
  "image:alt": string;
  "image:height": string;
  "image:width": string;
  site_name: string;
  title: string;
  type: string;
  url: string;
}>;

export const OpenGraph: VFC<Props> = ({ url, ...props }) => {
  const [ogp, setOgp] = useState<Types.Nullable<OpenGraphAttrs>>(null);

  useEffect(() => {
    const req = async () => {
      const response = await axios.post("/api/proxy", {
        body: undefined,
        url,
      });
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(response.data.body, "text/html");
      const metaTags = Array.from(htmlDoc.querySelector("head")?.querySelectorAll("meta[property^=og]") ?? []);
      setOgp(
        metaTags.reduce((acc, x) => {
          const property = x.getAttribute("property");
          const content = x.getAttribute("content");
          const name = property?.replace(/^og:/, "") ?? "";
          return { ...acc, [name]: content };
        }, {})
      );
    };
    req();
  }, [url]);

  const width = useMemo(() => {
    if (ogp === null) return "";
    if (props.width) return props.width;
    return ogp["image:width"] ? ogp["image:width"] + "px" : "100%";
  }, [props.width, ogp]);

  const height = useMemo(() => {
    if (ogp === null) return "";
    if (props.height) return props.height;
    return ogp["image:height"] ? ogp["image:height"] + "px" : "100%";
  }, [props.height, ogp]);

  if (ogp === null) return null;

  return (
    <Fragment>
      {ogp.image && (
        <section className={`flex w-full ${props.styles}`}>
          <img
            className="max-w-full align-middle"
            alt={ogp["image:alt"] ?? ogp.description}
            width={width}
            height={height}
            src={ogp.image}
          />
        </section>
      )}
    </Fragment>
  );
};
