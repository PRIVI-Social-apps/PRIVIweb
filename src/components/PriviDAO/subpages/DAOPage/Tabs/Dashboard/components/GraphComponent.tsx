import React, { useEffect, useState } from "react";
import { format, subDays } from 'date-fns'

import Box from "shared/ui-kit/Box";
import PrintChart from "shared/ui-kit/Chart/Chart";
import { StyledSelect, StyledMenuItem } from "shared/ui-kit/Styled-components/StyledComponents";
import { dashboardStyles } from '../Dashboard.styles';

export default function GraphComponent(props) {
  const classes = dashboardStyles();

  const [filterDays, setFilterDays] = useState<number>(7);
  const [data, setData] = useState<any[]>([]);
  const [hasData, setHasData] = useState<boolean>(false);

  useEffect(() => {
    getData();
  }, [filterDays]);

  const handleDaysChange = e => {
    setFilterDays(e.target.value);
  };

  const getData = () => {
    const today = format(new Date(), 'MM/dd/yyyy');
    const current = new Date(today).getTime();
    const limitDate = subDays(current, filterDays).getTime();
    const filteredData = props.data.filter(item => item.date >= limitDate);
    let graphData:any[] = [];
    for (let i = 0; i < filterDays; i++) {
      const dayData = filteredData.filter(item => (current - item.date) / 86400000 < (i + 1));
      graphData.unshift(dayData.length);
    }
    let hasGraphData = false;
    graphData = graphData.map((item, index) => {
      if (item > 0) {
        hasGraphData = true;
      }
      if (index === graphData.length - 1) {
        return item;
      } else {
        return item - graphData[index + 1];
      }
    })
    setData([...graphData]);
    setHasData(hasGraphData);
  };

  const Graph = () => (
    <div className={classes.graph}>
      {hasData && (
        <PrintChart
          config={{
            config: {
              data: {
                labels: new Array(data.length).fill(0),
                datasets: [
                  {
                    type: "line",
                    data: data,
                    fill: true,
                    borderColor: "#559AF4",
                    lineTension: 0.2,
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
                      return `${tooltipItem.yLabel}`;
                    },
                  },
                  //this removes legend color
                  displayColors: false,
                  yPadding: 10,
                  xPadding: 20,
                  position: "nearest",
                  caretSize: 10,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  bodyFontSize: 15,
                  bodyFontColor: "#303030",
                },
              },
            },
            configurer: (config: any, ref: CanvasRenderingContext2D): object => {
              let gradient = ref.createLinearGradient(0, 0, ref.canvas.clientWidth, ref.canvas.clientHeight / 2);
              gradient.addColorStop(0, "#00BFFF80");
              gradient.addColorStop(0.4, "#8D2EFF80");
              gradient.addColorStop(0.9, "#8D2EFF80");
              gradient.addColorStop(1, "#FF00C180");
              config.data.datasets[0].backgroundColor = gradient;

              return config;
            },
          }}
        />
      )}
    </div>
  )

  return (
    <div className={classes.graphContainer}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" flexDirection="column">
          <span className="graph-title">{`# of ${props.dataName}`}</span>
          <span className="graph-info">{props.total}</span>
        </Box>
        <StyledSelect
          className={classes.filterDropdown}
          value={filterDays}
          onChange={handleDaysChange}
        >
          <StyledMenuItem value={7}>Last 7 days</StyledMenuItem>
          <StyledMenuItem value={15}>Last 15 days</StyledMenuItem>
          <StyledMenuItem value={30}>Last 30 days</StyledMenuItem>
        </StyledSelect>
      </Box>
      <Graph />
    </div>
  );
}
