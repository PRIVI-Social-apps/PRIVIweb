import React, { useState, useEffect } from "react";
import PrintChart from "shared/ui-kit/Chart/Chart";
//import './Graph.css';

interface Data {
  x: number; //position
  y: number; //quantity
}

export default function Graph(props) {
  const [data, setData] = useState<Data[]>([{ x: 0, y: 0 }]);
  const [width, setWidth] = useState<number>(1000);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.type]);

  const getData = () => {
    //sort info list to be sure everything is o.k
    if (props.type === "Quadratic") {
      const quadrData = [
        { x: 1, y: 0 },
        { x: 2, y: 0.25 },
        { x: 3, y: 1 },
      ];

      setData(quadrData);
    } else if (props.type === "Linear") {
      const linData = [
        { x: 1, y: 0 },
        { x: 2, y: 1 },
      ];

      setData(linData);
    }
  };

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWidth(window.innerWidth > 960 ? 1000 : 500);
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return (
    <div style={{ width: width }}>
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
                  lineTension: props.type === "Quadratic" ? 0.4 : 0,
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
                    display: true,
                    gridLines: {
                      color: "#ffffff",
                    },
                    ticks: {
                      beginAtZero: true,
                      fontColor: "grey",
                      fontFamily: "Agrandir",
                    },
                  },
                ],
                yAxes: [
                  {
                    display: true,
                    gridLines: {
                      color: "grey",
                    },
                    ticks: {
                      display: false,
                      beginAtZero: true,
                    },
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
