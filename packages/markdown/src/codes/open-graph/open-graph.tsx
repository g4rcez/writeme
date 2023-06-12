import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { httpClient, Types } from "@writeme/core";

type Props = {
  url: string;
  height?: string;
  width?: string;
  className?: string;
};

type OpenGraphAttrs = Partial<{
  description: string;
  image: string;
  site_name: string;
  title: string;
  type: string;
  url: string;
  "image:alt": string;
  "image:height": string;
  "image:width": string;
  "video:height": string;
  "video:secure_url": string;
  "video:tag": string;
  "video:type": string;
  "video:url": string;
}>;

export default function OpenGraph({ url, ...props }: PropsWithChildren<Props>) {
  const [ogp, setOgp] = useState<Types.Nullable<OpenGraphAttrs>>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const req = async () => {
      try {
        const response = await httpClient.post<any>("/proxy", {
          body: undefined,
          url,
        });
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(response.data.body, "text/html");
        const metaTags = Array.from(htmlDoc.querySelector("head")?.querySelectorAll("meta[property^=og]") ?? []);
        setError("");
        setOgp(
          metaTags.reduce((acc, x) => {
            const property = x.getAttribute("property");
            const content = x.getAttribute("content");
            const name = property?.replace(/^og:/, "") ?? "";
            return { ...acc, [name]: content };
          }, {})
        );
      } catch (error: any) {
        setError(error.message);
      }
    };
    req();
  }, [url]);

  const width = useMemo(() => {
    if (ogp === null) return "";
    if (props.width) return props.width;
    return ogp["image:width"] ? ogp["image:width"] + "px" : "100%";
  }, [props.width, ogp]);

  const height = useMemo(() => {
    if (ogp === null) return "auto";
    if (props.height) return props.height;
    return ogp["image:height"] ? ogp["image:height"] + "px" : "100%";
  }, [props.height, ogp]);

  if (ogp === null) return null;

  if (error !== "") return <span className="text-fail-normal font-thin italic">{error}</span>;

  if (ogp["video:url"] || ogp["video:secure_url"]) {
    return (
      <section className={`mb-4 block w-full min-w-full ${props.className}`}>
        <iframe
          style={{ height }}
          width={width}
          height={height}
          className="block h-auto w-full max-w-full align-middle"
          src={ogp["video:secure_url"] ?? ogp["video:url"]}
          title={`${ogp.site_name} video player`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </section>
    );
  }

  if (ogp.image) {
    return (
      <section className={`mb-4 flex w-full ${props.className}`}>
        <img
          className="max-w-full align-middle"
          alt={ogp["image:alt"] ?? ogp.description}
          width={width}
          height={height}
          src={ogp.image}
        />
      </section>
    );
  }

  return null;
}
