import React, { useState, useEffect } from "react";
import PrintChart from "shared/ui-kit/Chart/Chart";

interface Data {
  x: string; //date
  y: number; //quantity
}

export default function SidebarGraph(props) {
  const [data, setData] = useState<Data[]>([{ x: "", y: 0 }]);

  useEffect(() => {
    if (props.data.length > 0) {
      setData(props.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  return (
    <div className="sidebar-graph" style={{ height: "100px" }}>
      <PrintChart
        config={{
          config: {
            data: {
              labels: data.map(item => item.x),
              datasets: [
                {
                  type: "line",
                  data: data.map(item => item.y),
                  fill: true,
                  backgroundColor: "#64C89E",
                  borderColor: "#64C89E",
                  lineTension: 0,
                },
              ],
            },

            options: {
              responsive: true,
              maintainAspectRatio: false,
              chartArea: {
                backgroundColor: "#F7F9FECC",
              },
              elements: {
                point: {
                  radius: 0,
                  hitRadius: 5,
                  hoverRadius: 5,
                },
              },

              legend: {
                display: false,
              },

              layout: {
                padding: {
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                },
              },

              scales: {
                xAxes: [
                  {
                    display: false,
                  },
                ],
                yAxes: [
                  {
                    display: false,
                  },
                ],
              },

              tooltips: {
                mode: "label",
                intersect: false,
                callbacks: {
                  //This removes the tooltip title
                  title: function () {},
                  label: function (tooltipItem, data) {
                    return `${tooltipItem.yLabel.toFixed(4)}`;
                  },
                },
                //this removes legend color
                displayColors: false,
                yPadding: 10,
                xPadding: 10,
                position: "nearest",
                caretSize: 10,
                backgroundColor: "rgba(255,255,255,0.9)",
                bodyFontSize: 15,
                bodyFontColor: "#303030",
              },
            },
          },
          configurer: (config: any, ref: CanvasRenderingContext2D): object => {
            let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight);
            gradient.addColorStop(0, "#64C89EFF");
            gradient.addColorStop(1, "#64C89E00");
            config.data.datasets[0].backgroundColor = gradient;

            return config;
          },
        }}
      />
    </div>
  );
}
