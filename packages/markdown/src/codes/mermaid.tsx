import { CSSProperties, useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

type Props = { content: string };

export default function Mermaid(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<Partial<CSSProperties>>({});
  const listener = useRef<{ element: HTMLElement; listener: () => void } | undefined>(undefined);
  useEffect(() => {
    const div = ref.current;
    if (div === null) return;
    mermaid.run({
      nodes: [div],
      suppressErrors: true,
      postRenderCallback: (id) => {
        const element = document.getElementById(id)!;
        const getH = (): CSSProperties => {
          const h = `${element.getBoundingClientRect().height}px`;
          return { height: h, minHeight: h };
        };
        setStyle(getH);
        const handler = () => setStyle(getH);
        element.addEventListener("resize", handler);
        listener.current = { element, listener: handler };
      },
    });
    return () => {
      listener.current?.element.removeEventListener("resize", listener.current?.listener);
    };
  }, []);

  return (
    <div style={style}>
      <div ref={ref} className="mermeid">
        {props.content}
      </div>
    </div>
  );
}
