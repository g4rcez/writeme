import React, { PropsWithChildren, useContext, useMemo, useState } from "react";
import { HttpDefault } from "./http-request/languages";

type Context = {
  language: string;
  framework: string;
};

type Values = {
  language: (l: string) => void;
  framework: (l: string) => void;
};

const initialState: Context = { language: HttpDefault.language, framework: HttpDefault.framework };

const context = React.createContext([initialState, {} as Values] as const);

export const CodeLanguageProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState(initialState);
  const set = useMemo(() => {
    return {
      language: (lang: string) => setState((prev) => ({ ...prev, language: lang })),
      framework: (framework: string) => setState((prev) => ({ ...prev, framework })),
    };
  }, []);
  return <context.Provider value={[state, set]}>{children}</context.Provider>;
};

export const useCodeLanguage = () => useContext(context);
