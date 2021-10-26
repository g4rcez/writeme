import { SiteContainer } from "components";
import { Writer } from "components/writer/writer";

export default function WriterPage() {
  return (
    <SiteContainer tag="section">
      <div className="w-full my-8 px-4">
        <Writer />
      </div>
    </SiteContainer>
  );
}
