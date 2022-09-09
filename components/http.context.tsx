import { AxiosError } from "axios";
import { httpClient } from "lib/http-client";
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
        statusCode: res.status,
        url: data.url,
        method: data.method ?? "GET",
        body: res.data,
        headers: res.headers,
        isError: false,
      });
    } catch (error) {
      if ((error as AxiosError).isAxiosError) {
        const e = error as AxiosError;
        setResponse({
          statusCode: e.response?.status ?? 500,
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
