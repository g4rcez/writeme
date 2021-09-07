import { createContext, useContext } from "react";

type MdxDocsContextProps = {
  root: HTMLElement | null;
  theme: string;
};

const MdxDocsContext = createContext<MdxDocsContextProps>({
  root: null,
  theme: "light",
});

export const MdxDocsProvider = MdxDocsContext.Provider;

export const useMdxDocs = () => useContext(MdxDocsContext);
