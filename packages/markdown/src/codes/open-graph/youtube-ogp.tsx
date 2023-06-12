import { useEffect, useRef, useState } from "react";
import { debounce } from "@writeme/core";
import { Input } from "@writeme/lego";
import OpenGraph from "./open-graph";

export default function YoutubeOgp() {
  const [link, setLink] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (input.current === null) return;
    const handler = debounce((e: Event) => setLink((e.target as HTMLInputElement).value), 1500);
    input.current.addEventListener("input", handler);
  }, []);

  return (
    <section>
      <div className="mb-1 mt-4 block">
        <Input placeholder="Youtube link" defaultValue={link} ref={input} />
      </div>
      <OpenGraph url={link} />
    </section>
  );
}
