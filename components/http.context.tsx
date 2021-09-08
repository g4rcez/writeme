import axios from "axios";
import { createContext, Dispatch, SetStateAction, useCallback, useContext, useState } from "react";

type Http = Types.Nullable<Types.BodyProxy>;
type Response = (Types.BodyProxy & { statusCode: number }) | null;

type HttpContext = {
  request: Http;
  loading: boolean;
  response: Response;
  onRequest: (data: Types.BodyProxy) => Promise<void>;
};

const Context = createContext<HttpContext>({} as never);

export const HttpContext: React.FC = ({ children }) => {
  const [request, setRequest] = useState<Http>(null);
  const [response, setResponse] = useState<Response>(null);
  const [loading, setLoading] = useState(false);

  const onRequest = useCallback(async (data: Types.BodyProxy) => {
    setLoading(true);
    setRequest(data);
    const res = await axios.post("/api/proxy", {
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
    });
    setLoading(false);
  }, []);

  return <Context.Provider value={{ request, loading, response, onRequest }}>{children}</Context.Provider>;
};

export const useHttpContext = () => useContext(Context);
