import React, { useState, useEffect } from "react";
import PrintChart from "shared/ui-kit/Chart/Chart";
import "./PopularityGraph.css";

interface Data {
  x: string; //date
  y: number; //followers
}

export default function PopularityGraph(props) {
  const [data, setData] = useState<Data[]>([{ x: "", y: 0 }]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = () => {
    let monthDatesList = [] as any;

    //make a list with the last 30 days
    for (let i = 0; i <= 30; i++) {
      monthDatesList.push({
        x: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 30 + i),
        y: 0,
      });
    }

    //update list adding followers gained each day
    monthDatesList.forEach((date, index) => {
      props.followers.forEach(follower => {
        if (
          new Date(date.x).getFullYear() === new Date(follower.date).getFullYear() &&
          new Date(date.x).getMonth() === new Date(follower.date).getMonth() &&
          new Date(date.x).getDate() === new Date(follower.date).getDate()
        ) {
          monthDatesList[index].y = monthDatesList[index].y + 1;
        }
      });
    });

    setData(monthDatesList);
  };

  return (
    <div className="popularity-graph">
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
