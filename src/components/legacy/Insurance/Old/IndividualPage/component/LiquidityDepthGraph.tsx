import React from "react";
import PrintChart from "shared/ui-kit/Chart/Chart";

export default function LiquidityDepthGraph(props: any) {
  const data = [
    {
      x: "10/6",
      y: 1.8,
    },
    {
      x: "10/9",
      y: 0.6,
    },
    {
      x: "10/12",
      y: 1,
    },
    {
      x: "10/15",
      y: 1,
    },
    {
      x: "10/18",
      y: 1.5,
    },
    {
      x: "10/20",
      y: 1.3,
    },
    {
      x: "10/22",
      y: 1.8,
    },
    {
      x: "10/25",
      y: 0.6,
    },
    {
      x: "10/30",
      y: 1,
    },
  ];

  return (
    <div className="barchart">
      <div className="chart" style={{ height: 160 }}>
        <PrintChart
          config={{
            config: {
              data: {
                labels: data.map(item => item.x),
                datasets: [
                  {
                    type: "line",
                    data: data.map(item => item.y),
                    fill: false,
                    backgroundColor: "#64C89E",
                    borderColor: "#64C89E",
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
          }}
        />
      </div>
    </div>
  );
}
