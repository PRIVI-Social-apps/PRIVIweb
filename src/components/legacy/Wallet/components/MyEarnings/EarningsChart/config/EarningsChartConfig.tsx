const chartConfig = {
  config: {
    type: "line",
    data: {
      labels: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
      ],
      datasets: [
        {
          label: "$",
          data: [],
          pointRadius: 0,
          backgroundColor: "#9FA8DA",
          borderColor: "#9FA8DA",
          pointBackgroundColor: "#9FA8DA",
          hoverBackgroundColor: "#9FA8DA",
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
              //padding: 10,
              fontColor: "#606060",
              fontFamily: "Agrandir",
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
            return `${tooltipItem.xLabel}: ${tooltipItem.yLabel.toFixed(4)}`;
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
    gradient.addColorStop(0, "rgba(159, 168, 218, 0.5)");
    gradient.addColorStop(0.5, "rgb(159, 168, 218, 0)");
    config.data.datasets[0].backgroundColor = gradient;

    return config;
  },
};

export default chartConfig;
