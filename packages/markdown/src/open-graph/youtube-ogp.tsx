import { Input, OpenGraph } from "src/components";
import { debounce } from "packages/core/src/debounce";
import { useEffect, useRef, useState } from "react";

export default function YoutubeOgp() {
  const [link, setLink] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (input.current === null) return;
    const handler = debounce((e: Event) => setLink((e.target as HTMLInputElement).value), 1500);
    input.current.addEventListener("input", handler);
  }, []);

  useEffect(() => {});
  return (
    <section>
      <div className="block mb-1 mt-4">
        <Input placeholder="Youtube link" defaultValue={link} ref={input} />
      </div>
      <OpenGraph url={link} />
    </section>
  );
}
