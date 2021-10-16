// https://usehooks.com/useMedia/
import { useCallback, useEffect, useState } from "react";
export const useMedia = <T extends string>(queries: string[], values: string[], defaultValue: T): T => {
  const [mediaQueryLists, setMediaQueryLists] = useState<MediaQueryList[]>([]);

  useEffect(() => {
    setMediaQueryLists(queries.map((q) => window.matchMedia(q)));
  }, [queries]);

  const getValue = useCallback(() => {
    const index = mediaQueryLists.findIndex((mql) => mql.matches);
    return typeof values[index] !== "undefined" ? values[index] : defaultValue;
  }, [defaultValue, mediaQueryLists, values]);

  const [value, setValue] = useState(getValue);

  useEffect(() => {
    const handler = () => setValue(getValue);
    mediaQueryLists.forEach((mql) => mql.addListener(handler));
    return () => mediaQueryLists.forEach((mql) => mql.removeListener(handler));
  }, [getValue, mediaQueryLists]);

  return value as never;
};
