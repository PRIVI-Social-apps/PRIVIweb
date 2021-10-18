import { formatNumber } from "shared/functions/commonFunctions";
const ClaimablePodChartConfig = token => {
  return {
    config: {
      data: {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        datasets: [
          {
            type: "line",
            label: token ?? "",
            data: [],
            pointRadius: 2,
            backgroundColor: token ? "#27E8D9" : "#FEDF87",
            borderColor: token ? "#27E8D9" : "#FEDF87",
            pointBackgroundColor: token ? "#27E8D9" : "#FEDF87",
            hoverBackgroundColor: token ? "#27E8D9" : "#FEDF87",
            borderJoinStyle: "round",
            borderCapStyle: "round",
            borderWidth: 3,
            cubicInterpolationMode: "monotone",
          },
        ],
      },

      options: {
        responsive: true,
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
            top: 50,
            bottom: 0,
          },
        },

        scales: {
          xAxes: [
            {
              display: false,
              gridLines: {
                color: "#ffffff",
                lineWidth: 50,
              },
              ticks: {
                beginAtZero: true,
                fontColor: "#6B6B6B",
                fontFamily: "Agrandir",
              },
            },
          ],
          yAxes: [
            {
              display: true,
              gridLines: {
                color: "#EFF2F8",
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
              return `${formatNumber(tooltipItem.yLabel, token, 4)}`;
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

        plugins: {
          datalabels: {
            display: function (context) {
              return context.dataset.data[context.dataIndex] !== 0;
            },
          },
        },
      },
    },
    configurer: (config: any, ref: CanvasRenderingContext2D): object => {
      let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight + 300);
      gradient.addColorStop(1, token ? "#C4C4C4" : "#FEDF87");
      gradient.addColorStop(0.5, token ? "#27E8D9" : "#FEDF87");
      config.data.datasets[0].backgroundColor = gradient;

      return config;
    },
  };
};

export default ClaimablePodChartConfig;
