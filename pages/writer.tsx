import { SiteContainer } from "components";
import { Writer } from "components/writer/writer";
import { httpClient } from "lib/http-client";
import { FormEventHandler, useState } from "react";
import { DocumentPutRequest } from "./api/document";

export default function WriterPage() {
  const [code, setCode] = useState("");
  const [id, setId] = useState("");

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    try {
      const body = id === "" ? { markdown: code } : { documentId: id, markdown: code };
      const response = await httpClient.put<DocumentPutRequest>("/document", body);
      setId(response.data.data.document?.id ?? "");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SiteContainer tag="section">
      <form onSubmit={onSubmit} className="w-full my-8 px-4">
        <Writer markdown={code} onChange={setCode} />
        <button className="button mt-4" type="submit">
          Save document
        </button>
      </form>
    </SiteContainer>
  );
}
