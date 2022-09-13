import { createContext, useContext } from "react";

type MdxDocsContextProps = {
  theme: string;
  titlePrefix: string;
};

const MdxDocsContext = createContext<MdxDocsContextProps>({ theme: "light", titlePrefix: "WriteMe" });

export const MdxDocsProvider = MdxDocsContext.Provider;

export const useMdxDocs = () => useContext(MdxDocsContext);
