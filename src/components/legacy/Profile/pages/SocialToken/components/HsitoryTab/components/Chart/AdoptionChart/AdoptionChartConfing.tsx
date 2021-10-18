const AdoptionChartConfig = {
  config: {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "$",
          data: [],
          pointRadius: 0,
          backgroundColor: "rgba(85, 154, 244, 1)",
          borderColor: "rgba(85, 154, 244, 1)",
          pointBackgroundColor: "rgba(85, 154, 244, 1)",
          hoverBackgroundColor: "rgba(85, 154, 244, 1)",
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
      legend: {
        display: false,
      },

      layout: {
        padding: {
          left: 5,
          right: 5,
          top: 50,
          bottom: 0,
        },
      },

      scales: {
        xAxes: [
          {
            display: false,
            gridLines: {
              display: false,
              drawBorder: false,
              drawOnChartArea: false,
            },
            ticks: {
              beginAtZero: true,
              fontColor: "#606060",
              fontFamily: "Montserrat",
              callback: function (dataLabel, index) {
                // Hide the label
                return "";
              },
            },
          },
        ],
        yAxes: [
          {
            display: false,
            gridLines: {},
            ticks: {
              beginAtZero: true,
              //min: 1
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
            return `${tooltipItem.xLabel}: $${tooltipItem.yLabel.toFixed(4)}`;
          },
        },
        //this removes legend color
        displayColors: false,
        yPadding: 10,
        xPadding: 10,
        position: "nearest",
        caretSize: 10,
        backgroundColor: "rgba(255,255,255,.9)",
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
    let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight + 200);
    gradient.addColorStop(0, "rgba(85, 154, 244, 0.5)");
    gradient.addColorStop(0.4, "rgba(85, 154, 244, 0)");
    config.data.datasets[0].backgroundColor = gradient;
    return config;
  },
};

export default AdoptionChartConfig;
