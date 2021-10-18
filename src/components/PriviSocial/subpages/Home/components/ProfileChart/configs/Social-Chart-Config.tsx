const SocialChartConfig = {
  config: {
    data: {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      datasets: [
        {
          type: "line",
          label: "$",
          data: [],
          pointRadius: 2,
          backgroundColor: "#FFFFFF",
          borderColor: "#7EDA5E",
          pointBackgroundColor: "#7EDA5E",
          hoverBackgroundColor: "#7EDA5E",
          borderJoinStyle: "round",
          borderCapStyle: "round",
          borderWidth: 3,
          cubicInterpolationMode: "monotone",
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      chartArea: {
        backgroundColor: "#FFFFFF",
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
            gridLines: {
              color: "rgba(177, 255, 0, 0.3)",
              lineWidth: 60,
            },
            ticks: {
              display: false,
              beginAtZero: false,
              fontColor: "#707582",
              fontFamily: "Agrandir",
            },
          },
        ],
        yAxes: [
          {
            display: false,
            gridLines: {
              color: "transaprent",
              lineWidth: 0,
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
            return `$${tooltipItem.yLabel.toFixed(4)}`;
          },
        },
        //this removes legend color
        displayColors: false,
        yPadding: 10,
        xPadding: 10,
        position: "nearest",
        caretSize: 10,
        backgroundColor: "#00FF15",
        bodyFontSize: 15,
        bodyFontColor: "white",
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
    gradient.addColorStop(1, "#00ff154d");
    gradient.addColorStop(0.5, "#b3ff004d");
    config.data.datasets[0].backgroundColor = gradient;

    return config;
  },
};

export default SocialChartConfig;
