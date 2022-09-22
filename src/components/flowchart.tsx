import { useEffect, useRef } from "react";

export const Flowchart = ({ code }: { code: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = async () => {
      try {
        const FlowChart = await import("flowchart.js");
        if (ref.current === null) return;
        const chart = FlowChart.parse(code);
        chart.drawSVG(ref.current);
      } catch (error) {
        console.error(error);
      }
    };
    mount();
  }, [code]);

  return <div ref={ref} />;
};

export default Flowchart;
