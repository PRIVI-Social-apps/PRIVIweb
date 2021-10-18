import React, { useEffect, useState } from "react";
import PrintChart from "shared/ui-kit/Chart/Chart";
import "./MediaCardGraph.css";

export default function RadialChart(props: any) {
  const [data, setData] = useState<any[]>([]);
  const [colorScale, setColorScale] = useState<string[]>([`url(#gradientId1)`]);

  useEffect(() => {
    if (props.list) {
      const d = [] as any;
      const c = [] as any;
      props.list.forEach(elem => {
        d.push({ x: elem.name, y: elem.total });
        if (elem.name.includes("Creator")) {
          c.push(`#8987E7`);
        } else if (elem.name.includes("Sale")) {
          c.push(`#559AF4`);
        } else if (elem.name.includes("Sold")) {
          c.push(`#FFC71B`);
        }
      });

      setData(d);
      setColorScale(c);
    }
  }, [props.list]);

  return (
    <div className={"radial-chart"}>
      <PrintChart
        config={{
          config: {
            type: "doughnut",
            data: {
              datasets: [
                {
                  data: data.map(item => item.y),
                  backgroundColor: colorScale,
                  hoverOffset: 0,
                  labels: data.map(item => item.x.toUpperCase()),
                },
              ],
            },
            options: {
              cutoutPercentage: 80,
              animation: false,
              rotation: Math.PI / 2,
              tooltips: { enabled: false },
              hover: { mode: null },
            },
          },
          configurer: (config: any, ref: CanvasRenderingContext2D): object => {
            for (let index = 0; index < config.data.datasets[0].labels.length; index++) {
              const label = config.data.datasets[0].labels[index];
              if (label.includes("Creator")) {
                const gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight);
                gradient.addColorStop(0, "#8987E7FF");
                gradient.addColorStop(1, "#8987E700");
                config.data.datasets[0].backgroundColor[index] = gradient;
              } else if (label.includes("Sale")) {
                const gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight);
                gradient.addColorStop(0, "#559AF4FF");
                gradient.addColorStop(1, "#559AF400");
                config.data.datasets[0].backgroundColor[index] = gradient;
              } else if (label.includes("Sold")) {
                const gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight);
                gradient.addColorStop(0, "#FFC71BFF");
                gradient.addColorStop(1, "#FFC71B00");
                config.data.datasets[0].backgroundColor[index] = gradient;
              }
            }

            return config;
          },
        }}
      />
    </div>
  );
}