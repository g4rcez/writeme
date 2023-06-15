import { CSSProperties, useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

type Props = { content: string };

export default function Mermaid(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<Partial<CSSProperties>>({ minHeight: "300px" });

  useEffect(() => {
    const div = ref.current;
    if (div === null) return;
    let listener: { element: HTMLElement; fn: () => void } | null = null;
    mermaid.run({
      nodes: [div],
      suppressErrors: true,
      postRenderCallback: (id) => {
        const element = document.getElementById(id)!;
        const getH = (): CSSProperties => ({
          minHeight: "300px",
          height: `${Math.max(element.getBoundingClientRect().height, 300)}px`,
        });
        setStyle(getH);
        const fn = () => setStyle(getH);
        element.addEventListener("resize", fn);
        listener = { element, fn };
      },
    });
    return () => {
      listener?.element.removeEventListener("resize", listener?.fn);
    };
  }, []);

  return (
    <div style={style} ref={ref} className="mermeid">
      {props.content}
    </div>
  );
}
