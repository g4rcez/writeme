import { useDarkMode } from "../hooks/use-dark-mode";
import { Strings } from "../lib/strings";
import { DetailedHTMLProps, ImgHTMLAttributes, useEffect, useState } from "react";

type Props = DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & {
  src: string;
};

const useImageUrl = (url: string) => {
  const [state, setState] = useState<URL | null>(null);
  useEffect(() => {
    if (url.startsWith("http://") || url.startsWith("https://")) return setState(new URL(url));
    setState(new URL(url, window.location.origin));
  }, [url]);
  return state;
};

export const Img = ({ src, ...props }: Props) => {
  const { mode } = useDarkMode();
  const [imgUrl, setImageUrl] = useState("");
  const isDarkMode = mode === "dark";
  const darkUrl = useImageUrl(src);

  useEffect(() => {
    const defaults = () => setImageUrl(src);
    if (mode !== "dark") return setImageUrl(src);
    if (darkUrl === null) return defaults();
    const qs = darkUrl.searchParams.get("__dark");
    if (!qs) return defaults();
    const converted = darkUrl.pathname.replace(darkUrl.pathname, qs);
    setImageUrl(new URL(converted, window.location.href).href);
  }, [darkUrl, mode]);

  return <img {...props} src={imgUrl} />;
};
