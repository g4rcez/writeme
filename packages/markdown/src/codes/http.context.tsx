import { httpClient, Types } from "@writeme/core";
import { createContext, Fragment, useCallback, useContext, useState } from "react";

type Http = Types.Nullable<Types.BodyProxy>;

export type HttpResponseProps = (Types.BodyProxy & { statusCode: number; isError: boolean }) | null;

type HttpContext = {
  request: Http;
  loading: boolean;
  response: HttpResponseProps;
  onRequest: (data: Types.BodyProxy) => Promise<void>;
};

const Context = createContext<HttpContext>({} as never);

export const HttpContext = ({ children }: any) => {
  const [request, setRequest] = useState<Http>(null);
  const [response, setResponse] = useState<HttpResponseProps>(null);
  const [loading, setLoading] = useState(false);

  const onRequest = useCallback(async (data: Types.BodyProxy) => {
    setLoading(true);
    setRequest(data);
    try {
      const res = await httpClient.post("/proxy", {
        url: data.url,
        method: data.method ?? "GET",
        body: data.body,
        headers: data.headers,
      });
      setResponse({
        statusCode: res.data.status ?? res.data.statusCode,
        url: data.url,
        method: data.method ?? "GET",
        body: res.data,
        headers: res.headers as any,
        isError: false,
      });
    } catch (error: any) {
      if (error.isAxiosError) {
        const e = error;
        console.error(e);
        const data = e.response?.data as any;
        setResponse({
          statusCode: data?.statusCode ?? 500,
          url: data.url,
          method: data.method ?? "GET",
          body: e.response?.data ?? null,
          headers: e.response?.headers ?? {},
          isError: true,
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Fragment>
      <Context.Provider value={{ request, loading, response, onRequest }}>{children}</Context.Provider>
    </Fragment>
  );
};

export const useHttpContext = () => useContext(Context);

export default HttpContext;
