import React, { useEffect, useState } from "react";
import PrintChart from "shared/ui-kit/Chart/Chart";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";

export default function GraphComponent(props) {
  const daysList = ["Last 7 days", "Last 15 days", "Last 30 days"];
  const [days, setDays] = useState<number>(7);
  const [data, setData] = useState<any[]>([]);
  const [perc, setPerc] = useState<number>(0);

  const months = ["Jan", "Feb", "March", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

  const handleDaysChange = e => {
    console.log(e.target.value);
    const d = daysList.indexOf(e.target.value) === 0 ? 7 : daysList.indexOf(e.target.value) === 1 ? 15 : 30;

    setDays(d);
  };

  useEffect(() => {
    getData();
  }, [days]);

  const getData = () => {
    if (props.data) {
      let sevenDaysList = [] as any;

      //make a list with the last selected days
      for (let i = 0; i <= days; i++) {
        sevenDaysList.push({
          x: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - days + i),
          y: 0,
        });
      }

      //update list adding followers gained each day
      sevenDaysList.forEach((date, index) => {
        props.data.forEach(data => {
          if (
            new Date(date.x).getFullYear() === new Date(data.x).getFullYear() &&
            new Date(date.x).getMonth() === new Date(data.x).getMonth() &&
            new Date(date.x).getDate() === new Date(data.x).getDate()
          ) {
            sevenDaysList[index].y = sevenDaysList[index].y + data.y;
          }
        });
      });

      setData(sevenDaysList);
    }
  };

  const Graph = () => {
    if (data.length > 0) {
      return (
        <div className="volume-graph">
          <PrintChart
            config={{
              config: {
                data: {
                  labels: data.map(
                    item => `${months[new Date(item.x).getUTCMonth()]} ${new Date(item.x).getUTCDate()}`
                  ),
                  datasets: [
                    {
                      type: "line",
                      data: data.map(item => item.y),
                      fill: true,
                      backgroundColor: "#36B191",
                      borderColor: "#36B191",
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
                        display: true,
                        gridLines: {
                          color: "#ffffff00",
                          lineWidth: 50,
                        },
                        ticks: {
                          beginAtZero: true,
                          fontColor: "#656E7E",
                          fontFamily: "Agrandir",
                        },
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
                gradient.addColorStop(0, "#36B191FF");
                gradient.addColorStop(1, "#36B19100");
                config.data.datasets[0].backgroundColor = gradient;

                return config;
              },
            }}
          />
        </div>
      );
    } else return null;
  };

  return (
    <div className="box">
      <div className="title">
        <div>
          <p>{`# of ${props.dataName}`}</p>
          <h3>{props.total}</h3>
        </div>
        <StyledSelect disableUnderline value={`${days} days`} onChange={handleDaysChange}>
          {daysList.map(day => (
            <StyledMenuItem key={day} value={day}>
              {day}
            </StyledMenuItem>
          ))}
        </StyledSelect>
      </div>
      <span>{perc === 0 ? `+${perc}%` : perc > 0 ? `+${perc}%` : `-${perc}%`}</span>
      <Graph />
    </div>
  );
}
